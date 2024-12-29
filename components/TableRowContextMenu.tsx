'use client';
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
	ContextMenuSeparator
} from '@/components/ui/context-menu';
import { adduserToConversationTrackerCookie } from '@/lib/conversation-tracker-cookie';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useConfirmation } from './ConfirmationProvider';
import { FiltersReducer } from '@/app/all-messages/useFilters';

const linkRegex = new RegExp(
	'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+',
	'g'
);

export default function TableRowContextMenu({
	user_id,
	message_id,
	children,
	isContextPage = false,
	isAllMessagesPage = false,
	copyToClipboard,
	setFilters
}: {
	user_id: number;
	message_id: number;
	children: React.ReactNode;
	isContextPage?: boolean;
	isAllMessagesPage?: boolean;
	copyToClipboard?: string;
	setFilters?: FiltersReducer;
}) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const setConfirmation = useConfirmation();
	function handleToast(text: string) {
		toast.error(text, {
			position: 'top-right',
			style: {
				color: 'black',
				backgroundColor: '#9f1239',
				fontSize: '1rem'
			},
			closeButton: false,
			duration: 15000
		});
	}
	function handleConfirmation(text: string) {
		setConfirmation({
			onConfirm: async () => {
				if (!navigator.clipboard) {
					handleToast('Clipboard API not supported, please copy manually');
					return;
				}
				const matchedText = text.match(linkRegex)?.flat();
				if (
					!matchedText ||
					matchedText.length === 0 ||
					matchedText.length === 2
				) {
					navigator.clipboard.writeText(text);
				} else {
					navigator.clipboard.writeText(matchedText[0]);
				}
				handleToast(
					'Copied to clipboard, this is an untrusted link. Open it at your own risk.'
				);
			},
			title: 'Copy Link to Clipboard?',
			description:
				'Please only open links that you know or trust. Opening untrusted links is like having raw sex with a stranger. It might feel good, but you are probably getting all the STDs.',
			confirmText: 'Copy',
			styles: {
				confirmButton: {
					variant: 'destructive'
				},
				cancelButton: {
					variant: 'outline'
				}
			}
		});
	}
	let params: string = '';
	searchParams.forEach((value, key) => {
		if (key === 'user_id') return;
		params += `&${key}=${value}`;
	});
	const contextLink = isAllMessagesPage
		? ``
		: `/users/${user_id}/messages/${message_id}/message-context`;
	return (
		<ContextMenu>
			<ContextMenuTrigger
				asChild
				onClick={(e) => {
					e.currentTarget.dispatchEvent(
						new MouseEvent('contextmenu', {
							bubbles: true,
							clientX: e.clientX,
							clientY: e.clientY
						})
					);
				}}
			>
				{children}
			</ContextMenuTrigger>
			<ContextMenuContent className="max-w-[50vw]">
				<Link
					rel="nofollow"
					className="h-full w-full"
					href={contextLink}
					onClick={(e) => {
						if (isAllMessagesPage) e.preventDefault();
						setFilters?.({
							user_id: user_id
						});
					}}
					{...(isContextPage || isAllMessagesPage ? { scroll: false } : {})}
				>
					<ContextMenuItem>
						{isContextPage || isAllMessagesPage
							? 'Highlight This User'
							: 'Show Message Context'}
					</ContextMenuItem>
				</Link>
				<ContextMenuSeparator />
				<Link
					rel="nofollow"
					className="h-full w-full"
					href={`/users/${user_id}/messages`}
				>
					<ContextMenuItem>Show All Messages From User</ContextMenuItem>
				</Link>
				<ContextMenuSeparator />
				<div
					className="h-full w-full"
					onClick={async () => {
						adduserToConversationTrackerCookie(user_id);
						router.refresh();
						toast.success(`${user_id} added to Conversation Tracker`, {
							style: {
								fontSize: '1rem'
							},
							richColors: true
						});
					}}
				>
					<ContextMenuItem>Add to Conversation Tracker</ContextMenuItem>
				</div>
				{copyToClipboard && (
					<>
						<ContextMenuSeparator />
						<div
							rel="nofollow"
							className="h-full w-full"
							onClick={() => handleConfirmation(copyToClipboard)}
						>
							<ContextMenuItem>Copy to Clipboard</ContextMenuItem>
						</div>
					</>
				)}
			</ContextMenuContent>
		</ContextMenu>
	);
}

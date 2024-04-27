'use client';
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
	ContextMenuSeparator
} from '@/components/ui/context-menu';
import { useRouter } from 'next/navigation';

export default function TableRowContextMenu({
	user_id,
	message_id,
	children,
	isContextPage = false,
	isAllMessagesPage = false,
	page
}: {
	user_id: number;
	message_id: number;
	children: React.ReactNode;
	isContextPage?: boolean;
	isAllMessagesPage?: boolean;
	page?: number;
}) {
	const router = useRouter();
	const contextLink = isAllMessagesPage
		? `/all-messages?page=${page || 1}&user_id=${user_id}`
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
				<ContextMenuItem
					onClick={() => {
						router.push(contextLink, { scroll: !isContextPage });
					}}
				>
					{isContextPage ? 'Highlight This User' : 'Show Message Context'}
				</ContextMenuItem>
				<ContextMenuSeparator />
				<ContextMenuItem
					onClick={() => router.push(`/users/${user_id}/messages`)}
				>
					Show All Messages From User
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}

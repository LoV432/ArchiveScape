'use client';
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
	ContextMenuSeparator
} from '@/components/ui/context-menu';
import Link from 'next/link';
import { toast } from 'sonner';

export default function TableRowContextMenu({
	user_id,
	message_id,
	children,
	isContextPage = false,
	copyToClipboard,
	page
}: {
	user_id: number;
	message_id: number;
	children: React.ReactNode;
	isContextPage?: boolean;
	copyToClipboard?: string;
	page?: number;
}) {
	const contextLink = `/users/${user_id}/messages/${message_id}/message-context`;
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
					{...(isContextPage ? { scroll: false } : {})}
				>
					<ContextMenuItem>
						{isContextPage ? 'Highlight This User' : 'Show Message Context'}
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
				{copyToClipboard && (
					<>
						<ContextMenuSeparator />
						<div
							rel="nofollow"
							className="h-full w-full"
							onClick={() => {
								if (!navigator.clipboard) {
									toast.error(
										'Clipboard API not supported, please copy manually',
										{
											position: 'bottom-right',
											important: true,
											style: {
												color: 'black',
												backgroundColor: '#9f1239',
												fontSize: '1rem'
											},
											closeButton: false
										}
									);
									return;
								}
								navigator.clipboard.writeText(copyToClipboard);
								toast.error(
									'Copied to clipboard, this is an untrusted link. Open it at your own risk',
									{
										position: 'bottom-right',
										important: true,
										style: {
											color: 'black',
											backgroundColor: '#9f1239',
											fontSize: '1rem'
										},
										closeButton: false
									}
								);
							}}
						>
							<ContextMenuItem>Copy to Clipboard</ContextMenuItem>
						</div>
					</>
				)}
			</ContextMenuContent>
		</ContextMenu>
	);
}

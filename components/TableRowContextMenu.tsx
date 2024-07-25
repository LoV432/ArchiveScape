'use client';
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
	ContextMenuSeparator
} from '@/components/ui/context-menu';
import Link from 'next/link';

export default function TableRowContextMenu({
	user_id,
	message_id,
	children,
	isContextPage = false,
	page
}: {
	user_id: number;
	message_id: number;
	children: React.ReactNode;
	isContextPage?: boolean;
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
			</ContextMenuContent>
		</ContextMenu>
	);
}

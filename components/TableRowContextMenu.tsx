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
	isContextPage = false
}: {
	user_id: number;
	message_id: number;
	children: React.ReactNode;
	isContextPage?: boolean;
}) {
	const router = useRouter();
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
						router.push(
							`/user/message-context?userId=${user_id}&messageId=${message_id}`
						);
					}}
				>
					{isContextPage ? 'Highlight This User' : 'Show Message Context'}
				</ContextMenuItem>
				<ContextMenuSeparator />
				<ContextMenuItem
					onClick={() => router.push(`/user/messages?userId=${user_id}`)}
				>
					Show All Messages From User
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}

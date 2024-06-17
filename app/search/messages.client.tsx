'use client';
import TableRowContextMenu from '@/components/TableRowContextMenu';
import {
	Table,
	TableCaption,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell
} from '@/components/ui/table';
import { Message } from '@/lib/all-messages';

export default function MessageSection({ messages }: { messages: Message[] }) {
	return (
		<Table className="mx-auto max-w-3xl text-base">
			<TableCaption hidden>Messages</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>ID</TableHead>
					<TableHead>Time</TableHead>
					<TableHead>Message</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{messages.map((message) => (
					<TableRowContextMenu
						key={message.id}
						message_id={message.id}
						user_id={message.user_id}
					>
						<TableRow tabIndex={0} key={message.id} className="relative">
							<TableCell
								className="mr-0 w-fit pr-0"
								style={{ color: message.color_name }}
							>
								{message.user_id}
							</TableCell>
							<TableCell
								className="w-[130px]"
								style={{ color: message.color_name }}
							>
								<div>
									{new Date(message.created_at).toLocaleString('en-PK', {
										year: '2-digit',
										month: 'short',
										day: 'numeric'
									})}
								</div>
								<div>
									{new Date(message.created_at).toLocaleString('en-PK', {
										timeStyle: 'short'
									})}
								</div>
							</TableCell>
							<TableCell
								style={{ color: message.color_name }}
								className="max-w-[150px] break-words sm:max-w-[500px]"
							>
								{message.message_text}
							</TableCell>
						</TableRow>
					</TableRowContextMenu>
				))}
			</TableBody>
		</Table>
	);
}

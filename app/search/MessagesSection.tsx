import { MessageCreatedAt } from '@/components/MessageCreatedAt';
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
		<Table className="mx-auto mb-3 max-w-3xl text-base">
			<TableCaption hidden>Messages</TableCaption>
			<TableHeader>
				<TableRow>
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
								style={{ color: message.color_name }}
								className="max-w-[150px] break-words pb-2 sm:max-w-[500px]"
							>
								<p>
									{message.message_text}{' '}
									{message.nickname ? (
										<>
											-{' '}
											<span className="text-sm italic">{message.nickname}</span>
										</>
									) : (
										''
									)}
								</p>
								<MessageCreatedAt time={message.created_at} />
								<p className="float-right text-sm text-gray-500">
									{message.user_id} -&nbsp;
								</p>
							</TableCell>
						</TableRow>
					</TableRowContextMenu>
				))}
			</TableBody>
		</Table>
	);
}

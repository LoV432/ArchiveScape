import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import TableRowContextMenu from '@/components/TableRowContextMenu';
import { Message } from '@/lib/all-messages';
import { MessagesPagination } from '@/components/Pagination';
import { MessageCreatedAt } from '@/components/MessageCreatedAt';

export default function AllMessagesPage({
	data,
	page
}: {
	data: { messages: Message[]; totalPages: number };
	page: number;
}) {
	return (
		<>
			<MessagesPagination totalPages={data.totalPages} page={page} />
			<MessageSection messages={data.messages} page={page} />
			<MessagesPagination totalPages={data.totalPages} page={page} />
		</>
	);
}

function MessageSection({
	messages,
	page
}: {
	messages: Message[];
	page: number;
}) {
	return (
		<Table className="mx-auto max-w-3xl text-base">
			<TableCaption hidden>Conversation Tracker</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Conversation Tracker</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{messages.map((message) => (
					<TableRowContextMenu
						key={message.id}
						user_id={message.user_id}
						message_id={message.id}
					>
						<TableRow tabIndex={0} key={message.id}>
							<TableCell
								style={{ color: message.color_name }}
								className="max-w-[150px] break-words pb-2 sm:max-w-[500px]"
							>
								<p>{message.message_text}</p>
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

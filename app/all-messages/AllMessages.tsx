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
import { mapToHex } from '@/lib/utils';
import { Message } from '@/lib/all-messages';
import { MessagesPagination } from '@/components/Pagination';
import { MessageCreatedAt } from '@/components/MessageCreatedAt';

export default function AllMessagesPage({
	data,
	page,
	highlightedUser
}: {
	data: { messages: Message[] };
	page: number;
	highlightedUser?: number;
}) {
	return (
		<>
			<MessagesPagination totalPages={500} page={page} />
			<MessageSection
				messages={data.messages}
				page={page}
				highlightedUser={highlightedUser}
			/>
			<MessagesPagination totalPages={500} page={page} />
		</>
	);
}

function MessageSection({
	messages,
	page,
	highlightedUser
}: {
	messages: Message[];
	page: number;
	highlightedUser?: number;
}) {
	return (
		<Table className="mx-auto max-w-3xl text-base">
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
						user_id={message.user_id}
						message_id={message.id}
						isAllMessagesPage
						isContextPage
						page={page}
					>
						<TableRow
							tabIndex={0}
							style={{
								// @ts-ignore
								'--highlight': `rgba(${mapToHex[message.color_name] || '255,255,255,0.15'})`
							}}
							className={`${message.user_id === highlightedUser ? `bg-[--highlight] ` : ''}`}
							key={message.id}
						>
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

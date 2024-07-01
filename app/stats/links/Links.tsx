import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import { MessagesPagination } from '@/components/Pagination';
import TableRowContextMenu from '@/components/TableRowContextMenu';
import { Message } from '@/lib/all-messages';
import { MessageCreatedAt } from '@/components/MessageCreatedAt';
import { getAllLinks } from '@/lib/all-links';
import { use } from 'react';

export default function AllMessagesWithLinks({ page }: { page: number }) {
	const data = use(getAllLinks(page));
	return (
		<>
			<MessagesPagination
				page={page}
				totalPages={data.totalPages}
				order="desc"
			/>
			<MessageSection messages={data.links} page={page} />
			<MessagesPagination
				page={page}
				totalPages={data.totalPages}
				order="desc"
			/>
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
						page={Number(page)}
					>
						<TableRow tabIndex={0} key={message.id}>
							<TableCell
								style={{ color: message.color_name }}
								className="max-w-[150px] break-words pb-2 sm:max-w-[600px]"
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

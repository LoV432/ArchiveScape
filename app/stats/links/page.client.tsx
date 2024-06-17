'use client';
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

export default function AllMessagesWithLinks({
	data,
	page
}: {
	data: { links: Message[]; totalPages: number };
	page: number;
}) {
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
					<TableHead>Time</TableHead>
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

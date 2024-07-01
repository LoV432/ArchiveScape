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

import { Message } from '@/lib/all-messages';
import { MessageCreatedAt } from '@/components/MessageCreatedAt';

export default function MessagesPage({
	data,
	page
}: {
	data: {
		messages: Message[];
		totalPages: number;
		user_name: string;
	};
	userId: number;
	page: number;
}) {
	return (
		<>
			<MessagesPagination
				page={page}
				totalPages={data.totalPages}
				order="desc"
			/>
			<MessageSection messages={data.messages} />
			<MessagesPagination
				page={page}
				totalPages={data.totalPages}
				order="desc"
			/>
		</>
	);
}

function MessageSection({ messages }: { messages: Message[] }) {
	return (
		<>
			<Table className="mx-auto max-w-3xl text-base">
				<TableCaption hidden>Messages</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Message</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{messages.map((message) => (
						<TableRow key={message.id} className="relative">
							<TableCell
								style={{ color: message.color_name }}
								className="max-w-[150px] break-words pb-2 sm:max-w-[500px]"
							>
								<p>{message.message_text}</p>
								<MessageCreatedAt time={message.created_at} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	);
}

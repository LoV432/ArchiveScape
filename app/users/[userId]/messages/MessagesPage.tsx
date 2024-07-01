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
import Link from 'next/link';

export default function MessagesPage({
	data,
	page,
	userId
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
			<MessageSection messages={data.messages} userId={userId} />
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
	userId
}: {
	messages: Message[];
	userId: number;
}) {
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
								<Link
									href={`/users/${userId}/messages/${message.id}/message-context`}
									className="before:absolute before:left-0 before:top-0 before:h-full before:w-full"
								>
									<p>{message.message_text}</p>
								</Link>
								<MessageCreatedAt time={message.created_at} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	);
}

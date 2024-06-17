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

import Link from 'next/link';
import { Message } from '@/lib/all-messages';
import ScrollToTop from '@/components/ScrollToTop';

export default function MessagesPage({
	data,
	userId,
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
			<ScrollToTop />
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
						<TableHead>Time</TableHead>
						<TableHead>Message</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{messages.map((message) => (
						<TableRow key={message.id} className="relative">
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
								<Link
									href={`/users/${userId}/messages/${message.id}/message-context`}
									className="before:absolute before:left-0 before:top-0 before:h-full before:w-full"
								>
									{message.message_text}
								</Link>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	);
}

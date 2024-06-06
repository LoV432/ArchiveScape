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

import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNewerMessages,
	PaginationOlderMessages
} from '@/components/ui/pagination';

import Link from 'next/link';
import GoToPageEllipsis from '@/components/GoToPageEllipsis';
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
			<MessageSection messages={data.messages} userId={userId} />
			<PaginationSection
				totalPages={data.totalPages}
				page={page}
				userId={userId}
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
									{new Date(message.created_at).toLocaleString('ur-PK', {
										dateStyle: 'short'
									})}
								</div>
								<div>
									{new Date(message.created_at).toLocaleString('ur-PK', {
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

function PaginationSection({
	userId,
	page,
	totalPages
}: {
	userId: number;
	page: number;
	totalPages: number;
}) {
	return (
		<Pagination className="place-self-end pb-7">
			<PaginationContent>
				<PaginationItem>
					<PaginationNewerMessages
						isActive={!(page === 1)}
						href={`/users/${userId}/messages?page=${page - 1 >= 1 ? page - 1 : page}`}
						className={`${
							page === 1 ? 'cursor-not-allowed' : 'cursor-pointer'
						} select-none`}
					/>
				</PaginationItem>
				<PaginationItem>
					<PaginationLink className="cursor-pointer">{page}</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<GoToPageEllipsis link={`/users/${userId}/messages?`} />
				</PaginationItem>
				<PaginationItem>
					<PaginationOlderMessages
						isActive={!(page === totalPages)}
						href={`/users/${userId}/messages?page=${page + 1 > totalPages ? page : page + 1}`}
						className={`${
							page === totalPages ? 'cursor-not-allowed' : 'cursor-pointer'
						} select-none`}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}

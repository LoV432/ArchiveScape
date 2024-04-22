'use client';
import { redirect, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
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
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNewerMessages,
	PaginationOlderMessages
} from '@/components/ui/pagination';
import { Suspense } from 'react';
import LoadingTable from '@/components/LoadingTable';
import LoadingOverlay from '@/components/LoadingOverlay';

type Message = {
	id: number;
	messageText: string;
	createdAt: string;
	colorName: string;
	userId: number;
};

export default function Page() {
	return (
		<main className="grid">
			<Suspense>
				<Main />
			</Suspense>
		</main>
	);
}

function Main() {
	const searchParams = useSearchParams();
	const userId = searchParams.get('userId');
	const messageId = searchParams.get('messageId');
	if (!messageId || messageId === '' || isNaN(Number(messageId))) {
		redirect('/');
	}
	if (!userId || userId === '' || isNaN(Number(userId))) {
		redirect('/');
	}
	const page = searchParams.get('page') || '1';

	const query = useQuery({
		queryKey: ['user-message-context', userId, page, messageId],
		queryFn: async () => {
			const res = await fetch(
				`/api/user/message-context?messageId=${messageId}&userId=${userId}&page=${page}`
			);
			if (!res.ok) {
				throw new Error('Error');
			}
			return (await res.json()) as {
				messages: Message[];
			};
		},
		placeholderData: (prev) => prev
	});

	return (
		<>
			{query.isLoading && <LoadingTable />}
			{query.isError && <p>Error</p>}
			{query.isPlaceholderData && <LoadingOverlay />}
			{query.isSuccess && (
				<>
					<MessageSection messages={query.data.messages} userId={userId} />
					<PaginationSection
						userId={userId}
						messageId={messageId}
						page={page}
					/>
				</>
			)}
		</>
	);
}

function MessageSection({
	messages,
	userId
}: {
	messages: Message[];
	userId: string;
}) {
	return (
		<Table className="mx-auto max-w-3xl">
			<TableCaption>Messages</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead className="w-[150px]">Time</TableHead>
					<TableHead>Message</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{messages.map((message) => (
					<TableRow
						key={message.id}
						className={`${message.userId === Number(userId) ? 'border-4 border-rose-800' : ''}`}
					>
						<TableCell style={{ color: message.colorName }}>
							{new Date(message.createdAt).toLocaleString('en-US', {
								timeStyle: 'short',
								dateStyle: 'short'
							})}
						</TableCell>
						<TableCell
							style={{ color: message.colorName }}
							className="break-words font-medium"
						>
							{message.messageText}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

function PaginationSection({
	userId,
	messageId,
	page
}: {
	userId: string;
	messageId: string;
	page: string;
}) {
	return (
		<Pagination className="place-self-end pb-7">
			<PaginationContent>
				<PaginationItem>
					<PaginationOlderMessages
						href={`/user/message-context?userId=${userId}&messageId=${messageId}&page=${Number(page) - 1}`}
						scroll={false}
						className={`select-none`}
					/>
				</PaginationItem>
				<PaginationItem>
					<PaginationLink className="cursor-pointer">{page}</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationEllipsis />
				</PaginationItem>
				<PaginationItem>
					<PaginationNewerMessages
						href={`/user/message-context?userId=${userId}&messageId=${messageId}&page=${Number(page) + 1}`}
						scroll={false}
						className={`select-none`}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}

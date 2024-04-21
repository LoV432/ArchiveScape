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
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNewerMessages,
	PaginationOlderMessages
} from '@/components/ui/pagination';

import { useQuery } from '@tanstack/react-query';
import { redirect, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

export type Message = {
	id: number;
	messageText: string;
	createdAt: string;
	color: string;
};

export default function Main() {
	return (
		<main className="grid min-h-lvh">
			<Suspense>
				<MessagesPage />
			</Suspense>
		</main>
	);
}

function MessagesPage() {
	const searchParams = useSearchParams();
	const userId = searchParams.get('userId');
	if (!userId || userId === '' || isNaN(Number(userId))) {
		redirect('/');
	}
	const page = searchParams.get('page') || '1';
	const query = useQuery({
		queryKey: ['user-messages', userId, page],
		queryFn: async () => {
			const res = await fetch(
				`/api/user/messages?userId=${userId}&page=${page}`
			);
			if (!res.ok) {
				throw new Error('Error');
			}
			return (await res.json()) as {
				messages: Message[];
				totalPages: number;
			};
		},
		placeholderData: (prev) => prev
	});

	return (
		<>
			{query.isLoading && (
				<Table className="mx-auto max-w-3xl">
					<TableCaption>Messages</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[500px]">Message</TableHead>
							<TableHead className="text-right">Created At</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell className="font-medium">Loading...</TableCell>
							<TableCell className="text-right">Loading...</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			)}
			{query.isError && <p>Error</p>}
			{query.isPlaceholderData && (
				<div className="absolute left-0 top-0 z-50 h-full w-full bg-neutral-800 bg-opacity-60">
					<div className="grid h-full place-items-center">
						<div className="lds-ripple">
							<div></div>
							<div></div>
						</div>
					</div>
				</div>
			)}
			{query.isSuccess && (
				<>
					<MessageSection messages={query.data.messages} userId={userId} />
					<PaginationSection
						totalPages={query.data.totalPages}
						page={page}
						userId={userId}
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
		<>
			<Table className="mx-auto max-w-3xl">
				<TableCaption>Messages</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Message</TableHead>
						<TableHead className="text-right">Created At</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{messages.map((message) => (
						<TableRow key={message.id} className="relative">
							<TableCell
								style={{ color: message.color }}
								className="max-w-[150px] break-words font-medium sm:max-w-[500px]"
							>
								<Link
									href={`/user/message-context?userId=${userId}&messageId=${message.id}`}
									className="before:absolute before:left-0 before:top-0 before:h-full before:w-full"
								>
									{message.messageText}
								</Link>
							</TableCell>
							<TableCell
								style={{ color: message.color }}
								className="text-right"
							>
								{new Date(message.createdAt).toLocaleString('en-US', {
									timeStyle: 'short',
									dateStyle: 'short'
								})}
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
	userId: string;
	page: string;
	totalPages: number;
}) {
	return (
		<Pagination className="place-self-end pb-7">
			<PaginationContent>
				<PaginationItem>
					<PaginationNewerMessages
						href={`/user/messages?userId=${userId}&page=${Number(page) - 1 >= 1 ? Number(page) - 1 : page}`}
						scroll={false}
						className={`${
							page === '1' ? 'cursor-not-allowed' : 'cursor-pointer'
						} select-none`}
					/>
				</PaginationItem>
				<PaginationItem>
					<PaginationLink className="cursor-pointer">{page}</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationEllipsis />
				</PaginationItem>
				<PaginationItem>
					<PaginationOlderMessages
						href={`/user/messages?userId=${userId}&page=${Number(page) + 1 > totalPages ? page : Number(page) + 1}`}
						scroll={false}
						className={`${
							page === String(totalPages)
								? 'cursor-not-allowed'
								: 'cursor-pointer'
						} select-none`}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}

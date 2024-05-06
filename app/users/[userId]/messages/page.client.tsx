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

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import LoadingTable from '@/components/LoadingTable';
import LoadingOverlay from '@/components/LoadingOverlay';
import GoToPageEllipsis from '@/components/GoToPageEllipsis';

type Message = {
	id: number;
	message_text: string;
	created_at: string;
	color_name: string;
};

export default function MessagesPage({ userId }: { userId: string }) {
	const searchParams = useSearchParams();
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
				user_name: string;
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
					<h1 className="place-self-center py-5 text-center text-xl font-bold sm:text-5xl">
						<p className="pb-1">All Messages From</p>{' '}
						<p>{query.data.user_name}</p>
					</h1>
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
									{new Date(message.created_at).toLocaleString('en-US', {
										dateStyle: 'short'
									})}
								</div>
								<div>
									{new Date(message.created_at).toLocaleString('en-US', {
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
	userId: string;
	page: string;
	totalPages: number;
}) {
	return (
		<Pagination className="place-self-end pb-7">
			<PaginationContent>
				<PaginationItem>
					<PaginationNewerMessages
						isActive={!(page === '1')}
						href={`/users/${userId}/messages?page=${Number(page) - 1 >= 1 ? Number(page) - 1 : page}`}
						className={`${
							page === '1' ? 'cursor-not-allowed' : 'cursor-pointer'
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
						isActive={!(page === String(totalPages))}
						href={`/users/${userId}/messages?page=${Number(page) + 1 > totalPages ? page : Number(page) + 1}`}
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

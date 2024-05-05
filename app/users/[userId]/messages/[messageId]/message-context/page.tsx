'use client';
import { redirect, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
import { Suspense } from 'react';
import LoadingTable from '@/components/LoadingTable';
import LoadingOverlay from '@/components/LoadingOverlay';
import TableRowContextMenu from '@/components/TableRowContextMenu';
import { mapToHex } from '@/lib/utils';
import GoToPageEllipsis from '@/components/GoToPageEllipsis';

type Message = {
	id: number;
	message_text: string;
	created_at: string;
	color_name: string;
	user_id: number;
};

export default function Page({
	params
}: {
	params: { userId: string; messageId: string };
}) {
	const { userId, messageId } = params;
	if (!messageId || messageId === '' || isNaN(Number(messageId))) {
		redirect('/');
	}
	if (!userId || userId === '' || isNaN(Number(userId))) {
		redirect('/');
	}
	return (
		<main className="grid">
			<Suspense>
				<Main userId={userId} messageId={messageId} />
			</Suspense>
		</main>
	);
}

function Main({ userId, messageId }: { userId: string; messageId: string }) {
	const searchParams = useSearchParams();
	const page = searchParams.get('page') || '1';
	const queryClient = useQueryClient();
	const query = useQuery({
		queryKey: ['user-message-context', page, messageId, userId],
		queryFn: async () => {
			const res = await fetch(
				`/api/user/message-context?messageId=${messageId}&userId=${userId}&page=${page}`
			);
			if (!res.ok) {
				throw new Error('Error');
			}
			return (await res.json()) as {
				messages: Message[];
				user_name: string;
			};
		},
		placeholderData: (prev) => {
			const lastQueryData = queryClient.getQueriesData({
				queryKey: ['user-message-context']
			});
			try {
				// This is a hacky way to get the last query data
				// It searches for all queries with ['user-message-context'] and returns an array
				// Then it returns the last query
				// We are using -2 because the last query is the current query
				return lastQueryData[lastQueryData.length - 2][
					lastQueryData[0].length - 1
				] as {
					messages: Message[];
					user_name: string;
				};
			} catch {
				return prev as
					| {
							messages: Message[];
							user_name: string;
					  }
					| undefined;
			}
		}
	});

	return (
		<>
			{query.isPlaceholderData && <LoadingOverlay />}
			{query.isLoading && <LoadingTable />}
			{query.isError && <p>Error</p>}
			{query.isSuccess && (
				<>
					<h1 className="place-self-center py-5 text-center text-xl font-bold sm:text-5xl">
						<p className="pb-2">Highlighted User</p>
						<p>{query.data.user_name}</p>
					</h1>
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
						isContextPage
						key={message.id}
						user_id={message.user_id}
						message_id={message.id}
					>
						<TableRow
							tabIndex={0}
							style={{
								// @ts-ignore
								'--highlight': `rgba(${mapToHex[message.color_name] || '255,255,255,0.15'})`
							}}
							key={message.id}
							className={`${message.user_id === Number(userId) ? `bg-[--highlight] ` : ''}`}
						>
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
								{message.message_text}
							</TableCell>
						</TableRow>
					</TableRowContextMenu>
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
						isActive
						href={`/users/${userId}/messages/${messageId}/message-context?page=${Number(page) - 1}`}
						className={`select-none`}
					/>
				</PaginationItem>
				<PaginationItem>
					<PaginationLink className="cursor-pointer">{page}</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<GoToPageEllipsis
						link={`/users/${userId}/messages/${messageId}/message-context?`}
					/>
				</PaginationItem>
				<PaginationItem>
					<PaginationNewerMessages
						isActive
						href={`/users/${userId}/messages/${messageId}/message-context?page=${Number(page) + 1}`}
						className={`select-none`}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}

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
import TableRowContextMenu from '@/components/TableRowContextMenu';
import { mapToHex } from '@/lib/utils';
import { getAllMessages, Message } from '@/lib/all-messages';
import { MessagesPagination } from './Pagination';
import { MessageCreatedAt } from '@/components/MessageCreatedAt';
import { Filters } from '@/components/Filters';
import { useState } from 'react';
import {
	useQuery,
	QueryClient,
	QueryClientProvider
} from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function AllMessagesPage({
	initialData,
	initialPage,
	highlightedUser
}: {
	initialData: { messages: Message[] };
	initialPage: number;
	highlightedUser?: number;
}) {
	const [page, setPage] = useState(initialPage);
	return (
		<>
			<MessagesPagination totalPages={500} page={page} setPage={setPage} />
			{/* TODO: Move this provider somewhere else */}
			<QueryClientProvider client={queryClient}>
				<MessageSection
					initialData={initialData}
					initialPage={initialPage}
					page={page}
					highlightedUser={highlightedUser}
				/>
			</QueryClientProvider>
			<MessagesPagination totalPages={500} page={page} setPage={setPage} />
		</>
	);
}

function MessageSection({
	initialData,
	page,
	initialPage,
	highlightedUser
}: {
	initialData: { messages: Message[] };
	page: number;
	initialPage: number;
	highlightedUser?: number;
}) {
	const { data, isPlaceholderData } = useQuery({
		queryKey: ['messages', page],
		queryFn: async () => {
			const { messages } = await getAllMessages(page);
			return { messages };
		},
		initialData: () => {
			if (page === initialPage) {
				return initialData;
			}
			return undefined;
		},
		placeholderData: (prev) => prev
	});
	return (
		<Table className="mx-auto max-w-3xl text-base">
			<TableCaption hidden>Messages</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>
						<div className="flex flex-row gap-2">
							<Filters />
							Message
						</div>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody
				className={`${isPlaceholderData ? 'opacity-50 grayscale' : ''}`}
			>
				{data?.messages.map((message) => (
					<TableRowContextMenu
						key={message.id}
						user_id={message.user_id}
						message_id={message.id}
						isAllMessagesPage
					>
						<TableRow
							tabIndex={0}
							style={{
								// @ts-ignore
								'--highlight': `rgba(${mapToHex[message.color_name] || '255,255,255,0.15'})`
							}}
							className={`${message.user_id === highlightedUser ? `bg-[--highlight] ` : ''}`}
							key={message.id}
						>
							<TableCell
								style={{ color: message.color_name }}
								className="max-w-[150px] break-words pb-2 sm:max-w-[500px]"
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

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
import { Filters } from './Filters';
import {
	useQuery,
	QueryClient,
	QueryClientProvider
} from '@tanstack/react-query';
import { useFilters, FiltersState, FiltersReducer } from './useFilters';
import { useEffect, useState } from 'react';

const queryClient = new QueryClient();

export default function AllMessagesPage({
	initialData
}: {
	initialData: { messages: Message[] };
}) {
	const [filters, setFilters] = useFilters();
	return (
		<>
			<MessagesPagination
				totalPages={500}
				filters={filters}
				setPage={setFilters}
			/>
			{/* TODO: Move this provider somewhere else */}
			<QueryClientProvider client={queryClient}>
				<MessageSection
					initialData={initialData}
					filters={filters}
					setFilters={setFilters}
				/>
			</QueryClientProvider>
			<MessagesPagination
				totalPages={500}
				filters={filters}
				setPage={setFilters}
			/>
		</>
	);
}

function MessageSection({
	initialData,
	filters,
	setFilters
}: {
	initialData: { messages: Message[] };
	highlightedUser?: number;
	filters: FiltersState;
	setFilters: FiltersReducer;
}) {
	const [isInitialData, setIsInitialData] = useState(true);
	function preFetch() {
		queryClient.prefetchQuery({
			queryKey: ['messages', { ...filters, page: filters.page - 1 }],
			queryFn: async () => {
				const { messages } = await getAllMessages({
					...filters,
					page: filters.page - 1
				});
				return { messages };
			}
		});
		queryClient.prefetchQuery({
			queryKey: ['messages', { ...filters, page: filters.page + 1 }],
			queryFn: async () => {
				const { messages } = await getAllMessages({
					...filters,
					page: filters.page + 1
				});
				return { messages };
			}
		});
	}
	const { data, isPlaceholderData } = useQuery({
		queryKey: ['messages', filters],
		queryFn: async () => {
			const { messages } = await getAllMessages(filters);
			preFetch();
			return { messages };
		},
		initialData: () => {
			if (isInitialData) {
				return initialData;
			}
			return undefined;
		},
		placeholderData: (prev) => prev
	});
	useEffect(() => {
		if (isInitialData) {
			setIsInitialData(false);
		}
	}, []);
	return (
		<Table className="mx-auto max-w-3xl text-base">
			<TableCaption hidden>Messages</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>
						<div className="flex flex-row gap-2">
							<Filters filters={filters} setFilters={setFilters} />
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
						setFilters={setFilters}
					>
						<TableRow
							tabIndex={0}
							style={{
								// @ts-ignore
								'--highlight': `rgba(${mapToHex[message.color_name] || '255,255,255,0.15'})`
							}}
							className={`${message.user_id === filters.user_id ? `bg-[--highlight] ` : ''}`}
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

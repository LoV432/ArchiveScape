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
import TableRowContextMenu from '@/components/TableRowContextMenu';

type Message = {
	id: number;
	message_text: string;
	created_at: string;
	color_name: string;
	user_id: number;
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
							<TableCell style={{ color: message.color_name }}>
								{new Date(message.created_at).toLocaleString('en-US', {
									timeStyle: 'short',
									dateStyle: 'short'
								})}
							</TableCell>
							<TableCell
								style={{ color: message.color_name }}
								className="max-w-[150px] break-words font-medium sm:max-w-[500px]"
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
						isActive
						href={`/user/message-context?userId=${userId}&messageId=${messageId}&page=${Number(page) + 1}`}
						scroll={false}
						className={`select-none`}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}

const mapToHex = {
	'#b3001b': '179,0,27,0.1',
	'#c073de': '199,115,222,0.15',
	'#edd892': '237,216,146,0.15',
	'#3685b5': '54,133,181,0.15',
	'#7bf1a8': '127,241,168,0.1',
	'#FE938C': '254,147,140,0.1',
	'#3BF4FB': '59,244,251,0.15'
};

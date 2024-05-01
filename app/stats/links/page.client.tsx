'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
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
import LoadingTable from '@/components/LoadingTable';
import LoadingOverlay from '@/components/LoadingOverlay';
import TableRowContextMenu from '@/components/TableRowContextMenu';
import GoToPageEllipsis from '@/components/GoToPageEllipsis';

type Message = {
	id: number;
	created_at: string;
	message_text: string;
	user_id: number;
	color_name: string;
};

export default function AllMessagesWithLinks() {
	const searchParams = useSearchParams();
	const page = searchParams.get('page') || '1';
	const query = useQuery({
		queryKey: ['all-links', page],
		queryFn: async () => {
			const res = await fetch(`/api/stats/links?page=${page}`);
			if (!res.ok) {
				throw new Error('Error');
			}
			return (await res.json()) as {
				links: Message[];
				totalPages: number;
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
					<MessageSection messages={query.data.links} page={page} />
					<PaginationSection totalPages={query.data.totalPages} page={page} />
				</>
			)}
		</>
	);
}

function MessageSection({
	messages,
	page
}: {
	messages: Message[];
	page: string;
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
						key={message.id}
						user_id={message.user_id}
						message_id={message.id}
						isContextPage
						page={Number(page)}
					>
						<TableRow tabIndex={0} key={message.id}>
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
	totalPages,
	page
}: {
	totalPages: number;
	page: string;
}) {
	return (
		<Pagination className="place-self-end pb-7">
			<PaginationContent>
				<PaginationItem>
					<PaginationNewerMessages
						isActive
						href={`/stats/links?page=${Number(page) - 1 >= 1 ? Number(page) - 1 : page}`}
						className={`${
							page === '1' ? 'cursor-not-allowed' : 'cursor-pointer'
						} select-none`}
					/>
				</PaginationItem>
				<PaginationItem>
					<PaginationLink className="cursor-pointer">{page}</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<GoToPageEllipsis link={`/stats/links?`} />
				</PaginationItem>
				<PaginationItem>
					<PaginationOlderMessages
						isActive
						href={`/stats/links?page=${Number(page) + 1 > totalPages ? page : Number(page) + 1}`}
						className={`select-none`}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}

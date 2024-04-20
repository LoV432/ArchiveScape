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
	PaginationNext,
	PaginationPrevious
} from '@/components/ui/pagination';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

export default function UserMessages() {
	const searchParams = useSearchParams();
	const userId = searchParams.get('userId');
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
				messages: { messageText: string; createdAt: string; color: string }[];
				totalPages: number;
			};
		},
		placeholderData: (prev) => prev
	});

	return (
		<main className="grid min-h-screen place-items-center">
			{query.isLoading && (
				<Table className="cursor-default">
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
					<Table className="cursor-default">
						<TableCaption>Messages</TableCaption>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[500px]">Message</TableHead>
								<TableHead className="text-right">Created At</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{query.data.messages.map((message) => (
								<TableRow key={message.createdAt}>
									<TableCell
										style={{ color: message.color }}
										className="font-medium"
									>
										{message.messageText}
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
					{query.data.totalPages > 1 && (
						<Pagination className="pb-7">
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										href={`/user/messages?userId=${userId}&page=${Number(page) - 1 >= 1 ? Number(page) - 1 : page}`}
										scroll={false}
										className={`${
											page === '1' ? 'cursor-not-allowed' : 'cursor-pointer'
										} select-none`}
									/>
								</PaginationItem>
								<PaginationItem>
									<PaginationLink className="cursor-pointer">
										{page}
									</PaginationLink>
								</PaginationItem>
								<PaginationItem>
									<PaginationEllipsis />
								</PaginationItem>
								<PaginationItem>
									<PaginationNext
										href={`/user/messages?userId=${userId}&page=${Number(page) + 1 > query.data.totalPages ? page : Number(page) + 1}`}
										scroll={false}
										className={`${
											page === String(query.data.totalPages)
												? 'cursor-not-allowed'
												: 'cursor-pointer'
										} select-none`}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					)}
				</>
			)}
		</main>
	);
}

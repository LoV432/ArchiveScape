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
import { useSearchParams, useRouter } from 'next/navigation';

export default function UserMessages() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const userId = searchParams.get('userId');
	const page = searchParams.get('page') || '0';
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
				messages: { id: string; messageText: string; createdAt: string }[];
				totalPages: number;
			};
		},
		placeholderData: (prev) => prev
	});

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
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
				<div className="absolute left-0 top-0 h-full w-full bg-neutral-800 bg-opacity-60">
					<div className="flex h-full w-full items-center justify-center">
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
								<TableRow key={message.id}>
									<TableCell className="font-medium">
										{message.messageText}
									</TableCell>
									<TableCell className="text-right">
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
						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										className={`${
											page === '0' ? 'cursor-not-allowed' : 'cursor-pointer'
										} select-none`}
										onClick={() => {
											if (page === '0') return;
											router.push(
												`/user/messages?userId=${userId}&page=${Number(page) - 1}`
											);
										}}
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
										className={`${
											page === String(query.data.totalPages - 1)
												? 'cursor-not-allowed'
												: 'cursor-pointer'
										} select-none`}
										onClick={() => {
											if (page === String(query.data.totalPages - 1)) return;
											router.push(
												`/user/messages?userId=${userId}&page=${Number(page) + 1}`
											);
										}}
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

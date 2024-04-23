'use client';
import { useQuery } from '@tanstack/react-query';
import {
	Table,
	TableCaption,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell
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
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import LoadingOverlay from '@/components/LoadingOverlay';
import { Suspense, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

type Message = {
	id: string;
	created_at: number;
	message_text: string;
	color_name: string;
	user_id: number;
};

export default function Page() {
	return (
		<main className="grid">
			<Suspense>
				<SearchPage />
			</Suspense>
		</main>
	);
}

function SearchPage() {
	const searchParams = useSearchParams();
	const searchQuery = searchParams.get('search') || '';
	const page = searchParams.get('page') || '1';
	const router = useRouter();
	const searchElementRef = useRef<HTMLInputElement>(null);
	const query = useQuery({
		queryKey: ['search', searchQuery, page],
		queryFn: async () => {
			if (searchQuery === '') {
				return { messages: [], totalPages: 0 };
			}
			const res = await fetch(`/api/search?search=${searchQuery}&page=${page}`);
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
	useEffect(() => {
		document.addEventListener('keydown', (e) => {
			if (e.key === '`') {
				setTimeout(() => {
					searchElementRef.current?.focus();
				}, 10);
			}
		});
	}, []);
	return (
		<>
			<div className="relative mx-auto mt-10 block h-14 w-2/3 max-w-[800px]">
				<input
					type="text"
					placeholder={`Start typing...`}
					className="h-full w-full rounded border border-gray-300 border-opacity-35 text-center text-2xl font-bold focus-visible:border-opacity-70 focus-visible:outline-none"
					defaultValue={searchQuery}
					onFocus={(e) =>
						e.target.setAttribute('placeholder', 'Start typing...')
					}
					onBlur={(e) => e.target.setAttribute('placeholder', 'Search')}
					autoFocus
					ref={searchElementRef}
					onKeyUp={(e: any) => {
						if (e.key === 'Enter') {
							router.push(`/search?search=${e.target.value}`);
						}
					}}
				/>
				<div className="absolute right-0 top-0 h-full w-16 p-2">
					<Button
						onClick={() =>
							router.push(`/search?search=${searchElementRef.current?.value}`)
						}
						className="h-full w-full rounded bg-transparent text-3xl text-white hover:bg-zinc-800"
					>
						⏎
					</Button>
				</div>
			</div>
			{query.isError && <p>Error</p>}
			{query.isPlaceholderData && <LoadingOverlay />}
			{query.isSuccess &&
				!query.isRefetching &&
				query.data.messages.length > 0 && (
					<>
						<Table className="mx-auto max-w-3xl">
							<TableCaption>Messages</TableCaption>
							<TableHeader>
								<TableRow>
									<TableHead className="mr-0 w-fit pr-0">ID</TableHead>
									<TableHead className="w-[150px]">Time</TableHead>
									<TableHead>Message</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{query.data.messages.map((message) => (
									<TableRow key={message.id} className="relative">
										<TableCell
											className="mr-0 w-fit pr-0"
											style={{ color: message.color_name }}
										>
											{message.user_id}
										</TableCell>
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
											<Link
												href={`/user/message-context?userId=${message.user_id}&messageId=${message.id}`}
												className="before:absolute before:left-0 before:top-0 before:h-full before:w-full"
											>
												{message.message_text}
											</Link>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
						{query.data.totalPages > 1 && (
							<PaginationSection
								searchQuery={searchQuery}
								page={page}
								totalPages={query.data.totalPages}
							/>
						)}
					</>
				)}
		</>
	);
}

function PaginationSection({
	searchQuery,
	page,
	totalPages
}: {
	searchQuery: string;
	page: string;
	totalPages: number;
}) {
	return (
		<Pagination className="place-self-end pb-7">
			<PaginationContent>
				<PaginationItem>
					<PaginationNewerMessages
						href={`/search?search=${searchQuery}&page=${Number(page) - 1 >= 1 ? Number(page) - 1 : page}`}
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
						href={`/search?search=${searchQuery}&page=${Number(page) + 1 > totalPages ? page : Number(page) + 1}`}
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

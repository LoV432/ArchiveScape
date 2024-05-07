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
	PaginationItem,
	PaginationLink,
	PaginationNewerMessages,
	PaginationOlderMessages
} from '@/components/ui/pagination';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import LoadingOverlay from '@/components/LoadingOverlay';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import cat from '@/public/cat.gif';
import scribble from '@/public/scribble.gif';
import Image from 'next/image';
import TableRowContextMenu from '@/components/TableRowContextMenu';
import GoToPageEllipsis from '@/components/GoToPageEllipsis';
import LoadingTable from '@/components/LoadingTable';

type Message = {
	id: number;
	created_at: number;
	message_text: string;
	color_name: string;
	user_id: number;
};

export default function SearchPage() {
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
			if (e.key === '`' || e.key === '/') {
				setTimeout(() => {
					searchElementRef.current?.focus();
				}, 10);
			}
		});
		if ('ontouchstart' in window) {
			searchElementRef.current?.setAttribute('placeholder', 'Search');
		} else {
			searchElementRef.current?.focus();
		}
	}, []);
	return (
		<>
			<div className="relative mx-auto mt-10 block h-14 w-2/3 max-w-[800px]">
				<input
					type="text"
					placeholder="Search"
					className="h-full w-full rounded border border-gray-300 border-opacity-35 text-center text-2xl font-bold focus-visible:border-opacity-70 focus-visible:outline-none"
					defaultValue={searchQuery}
					onFocus={(e) =>
						e.target.setAttribute('placeholder', 'Start typing...')
					}
					onBlur={(e) => e.target.setAttribute('placeholder', 'Search')}
					ref={searchElementRef}
					onKeyUp={(e: any) => {
						if (e.key === 'Enter') {
							router.push(`/search?search=${e.target.value}`);
						}
					}}
				/>
				<div className="absolute right-0 top-0 hidden h-full w-16 p-2 sm:block">
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
			{query.isLoading && <LoadingTable />}
			{query.isSuccess &&
				!query.isRefetching &&
				query.data.messages.length === 0 && (
					<div className="flex flex-col place-items-center gap-4">
						{searchQuery !== '' && (
							<>
								<p className="text-xl font-semibold">No results :(</p>
								<Image
									unoptimized
									src={scribble}
									alt="no search results"
									width={200}
									height={200}
								/>
							</>
						)}
						{searchQuery === '' && (
							<Image
								unoptimized
								src={cat}
								alt="cat waiting patiently"
								width={400}
								height={400}
							/>
						)}
					</div>
				)}
			{query.isSuccess && query.data.messages.length > 0 && (
				<>
					<Table className="mx-auto max-w-3xl text-base">
						<TableCaption hidden>Messages</TableCaption>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>Time</TableHead>
								<TableHead>Message</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{query.data.messages.map((message) => (
								<TableRowContextMenu
									key={message.id}
									message_id={message.id}
									user_id={message.user_id}
								>
									<TableRow tabIndex={0} key={message.id} className="relative">
										<TableCell
											className="mr-0 w-fit pr-0"
											style={{ color: message.color_name }}
										>
											{message.user_id}
										</TableCell>
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
						isActive={!(page === '1')}
						href={`/search?search=${searchQuery}&page=${Number(page) - 1 >= 1 ? Number(page) - 1 : page}`}
						className={`${
							page === '1' ? 'cursor-not-allowed' : 'cursor-pointer'
						} select-none`}
					/>
				</PaginationItem>
				<PaginationItem>
					<PaginationLink className="cursor-pointer">{page}</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<GoToPageEllipsis link={`/search?search=${searchQuery}`} />
				</PaginationItem>
				<PaginationItem>
					<PaginationOlderMessages
						isActive={!(page === String(totalPages))}
						href={`/search?search=${searchQuery}&page=${Number(page) + 1 > totalPages ? page : Number(page) + 1}`}
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

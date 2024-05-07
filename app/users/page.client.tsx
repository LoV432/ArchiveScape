'use client';
import LoadingOverlay from '@/components/LoadingOverlay';
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
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious
} from '@/components/ui/pagination';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import GoToPageEllipsis from '@/components/GoToPageEllipsis';
import LoadingTable from '@/components/LoadingTable';

type User = {
	id: number;
	user_name: string;
	message_count: number;
};

export default function UsersPage() {
	const searchParams = useSearchParams();
	const page = searchParams.get('page') || '1';
	const query = useQuery({
		queryKey: ['users', page],
		queryFn: async () => {
			const res = await fetch(`/api/users?page=${page}`);
			if (!res.ok) {
				throw new Error('Error');
			}
			return (await res.json()) as { users: User[]; totalPages: number };
		},
		placeholderData: (prev) => prev
	});
	return (
		<>
			{query.isPlaceholderData && <LoadingOverlay />}
			{query.isLoading && <LoadingTable />}
			{query.isError && <p>Error</p>}
			{query.isSuccess && (
				<>
					<h1 className="place-self-center py-5 text-center text-xl font-bold sm:text-5xl">
						<p className="pb-2">All Users</p>
					</h1>
					<UsersTable users={query.data.users} />
					<PaginationSection page={page} totalPages={query.data.totalPages} />
				</>
			)}
		</>
	);
}

function UsersTable({ users }: { users: User[] }) {
	return (
		<Table className="mx-auto max-w-3xl text-base">
			<TableCaption>All Users</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>User Name</TableHead>
					<TableHead className="text-right">Total Messages</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{users.map((user) => (
					<TableRow className="relative" key={user.id}>
						<TableCell
							className={`block max-w-[calc(100vw/1.5)] overflow-hidden text-ellipsis font-medium`}
						>
							<Link
								className="text-base before:absolute before:left-0 before:top-0 before:h-full before:w-full sm:text-lg"
								href={`/users/${user.id}/messages`}
							>
								{user.user_name}
							</Link>
						</TableCell>
						<TableCell className="text-right text-base font-medium sm:text-lg">
							{user.message_count}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

function PaginationSection({
	page,
	totalPages
}: {
	page: string;
	totalPages: number;
}) {
	return (
		<Pagination className="place-self-end pb-7">
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						isActive={!(page === '1')}
						href={`/users?page=${Number(page) - 1 >= 1 ? Number(page) - 1 : page}`}
						className={`${
							page === '1' ? 'cursor-not-allowed' : 'cursor-pointer'
						} select-none`}
					/>
				</PaginationItem>
				<PaginationItem>
					<PaginationLink className="cursor-pointer">{page}</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<GoToPageEllipsis link={`/users?`} />
				</PaginationItem>
				<PaginationItem>
					<PaginationNext
						isActive
						href={`/users?page=${Number(page) + 1 > totalPages ? page : Number(page) + 1}`}
						className={`select-none`}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}

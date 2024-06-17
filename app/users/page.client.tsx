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
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious
} from '@/components/ui/pagination';
import Link from 'next/link';
import GoToPageEllipsis from '@/components/GoToPageEllipsis';
import { User } from '@/lib/all-users';

export default function UsersPage({
	data,
	page
}: {
	data: { users: User[]; totalPages: number };
	page: number;
}) {
	return (
		<>
			<UsersTable users={data.users} />
			<PaginationSection page={page} totalPages={data.totalPages} />
		</>
	);
}

function UsersTable({ users }: { users: User[] }) {
	return (
		<Table className="mx-auto max-w-3xl text-base">
			<TableCaption hidden>All Users</TableCaption>
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
	page: number;
	totalPages: number;
}) {
	return (
		<Pagination className="place-self-end pb-7">
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						isActive={!(page === 1)}
						href={`/users?page=${page - 1 >= 1 ? page - 1 : page}`}
						className={`${
							page === 1 ? 'cursor-not-allowed' : 'cursor-pointer'
						} select-none`}
					/>
				</PaginationItem>
				<PaginationItem>
					<PaginationLink className="cursor-pointer">{page}</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<GoToPageEllipsis />
				</PaginationItem>
				<PaginationItem>
					<PaginationNext
						isActive={!(page === totalPages)}
						href={`/users?page=${page + 1 > totalPages ? page : page + 1}`}
						className={`select-none ${page === totalPages ? 'cursor-not-allowed' : ''}`}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}

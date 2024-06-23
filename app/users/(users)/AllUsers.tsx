import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import { MessagesPagination } from '@/components/Pagination';
import Link from 'next/link';
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
			<MessagesPagination
				totalPages={data.totalPages}
				page={page}
				order="desc"
				type="default"
			/>
			<UsersTable users={data.users} />
			<MessagesPagination
				totalPages={data.totalPages}
				page={page}
				order="desc"
				type="default"
			/>
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

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import type { User } from '@/lib/all-users';
import LinkWithHoverPrefetch from '@/components/LinkWithHoverPrefetch';
import { use } from 'react';

export function UsersTable({ data }: { data: Promise<{ users: User[] }> }) {
	const { users } = use(data);
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
							<LinkWithHoverPrefetch
								className="text-base before:absolute before:left-0 before:top-0 before:h-full before:w-full sm:text-lg"
								href={`/users/${user.id}`}
							>
								{user.user_name}
							</LinkWithHoverPrefetch>
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

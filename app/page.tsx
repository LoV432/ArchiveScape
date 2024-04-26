'use client';
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
import Link from 'next/link';

export default function Home() {
	const query = useQuery({
		queryKey: ['top-users'],
		queryFn: async () => {
			const res = await fetch('/api/top-users');
			if (!res.ok) {
				throw new Error('Error');
			}
			return (await res.json()) as {
				topUsers: {
					user_name: string;
					user_id: number;
					message_count: number;
				}[];
			};
		}
	});

	return (
		<main className="grid">
			<h1 className="place-self-center py-5 text-4xl font-bold tracking-widest sm:text-6xl">
				TOP 10 USERS
			</h1>
			{query.isLoading && <div className="place-self-center">Loading...</div>}
			{query.isError && <p>Error</p>}
			{query.isSuccess && (
				<Table className="mx-auto max-w-3xl">
					<TableCaption hidden>Top Users</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>User</TableHead>
							<TableHead className="text-right">Message Count</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{query.data.topUsers.map((user, index) => (
							<TableRow className="relative" key={user.user_id}>
								<TableCell
									className={`block max-w-[calc(100vw/1.5)] overflow-hidden text-ellipsis font-medium ${colorGradientByIndex(index)}`}
								>
									<Link
										href={`/user/messages?userId=${user.user_id}`}
										className="text-base before:absolute before:left-0 before:top-0 before:h-full before:w-full sm:text-lg"
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
			)}
		</main>
	);
}

function colorGradientByIndex(index: number) {
	const colors = [
		'text-red-500',
		'text-orange-500',
		'text-amber-500',
		'text-lime-500',
		'text-green-500',
		'text-emerald-500',
		'text-teal-500',
		'text-cyan-500',
		'text-sky-500',
		'text-blue-500'
	];
	return colors[index];
}

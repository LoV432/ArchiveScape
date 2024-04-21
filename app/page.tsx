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
				userName: string;
				userId: number;
				messageCount: number;
			}[];
		}
	});

	return (
		<main className="grid min-h-screen">
			{query.isLoading && <div className="place-self-center">Loading...</div>}
			{query.isError && <p>Error</p>}
			{query.isSuccess && (
				<Table className="mx-auto max-w-3xl">
					<TableCaption>Top Users</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[100px]">User</TableHead>
							<TableHead className="text-right">Message Count</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{query.data.map((user, index) => (
							<TableRow className="relative" key={user.userId}>
								<TableCell
									className={`font-medium ${colorGradientByIndex(index)}`}
								>
									<Link
										href={`/user/messages?userId=${user.userId}`}
										className="before:absolute before:left-0 before:top-0 before:h-full before:w-full"
									>
										{user.userName}
									</Link>
								</TableCell>
								<TableCell className="text-right">
									{user.messageCount}
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

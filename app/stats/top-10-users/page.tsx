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
import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';
export const dynamic = 'force-dynamic';
import LinkWithHoverPrefetch from '../../../components/LinkWithHoverPrefetch';
import { Metadata } from 'next/types';

export const metadata: Metadata = {
	title: 'Top 10 Users | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/'
};

export default async function Home() {
	const data = (
		await db.query(`SELECT u.user_name, m.message_count, m.user_id as id
							FROM users u
							INNER JOIN (
								SELECT COUNT(*) AS message_count, user_id
								FROM messages
								GROUP BY user_id
								ORDER BY message_count desc
								LIMIT 10
							) m ON u.id = m.user_id
							ORDER BY m.message_count DESC;`)
	).rows as { user_name: string; id: number; message_count: number }[];

	return (
		<main className="grid">
			<h1 className="place-self-center py-5 text-4xl font-bold tracking-widest sm:text-6xl">
				TOP 10 USERS
			</h1>
			<Table className="mx-auto max-w-3xl">
				<TableCaption hidden>Top Users</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>User</TableHead>
						<TableHead className="text-right">Message Count</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((user, index) => (
						<TableRow className="relative" key={user.id}>
							<TableCell
								className={`block max-w-[calc(100vw/1.5)] overflow-hidden text-ellipsis font-medium ${colorGradientByIndex(index)}`}
							>
								<LinkWithHoverPrefetch
									href={`/users/${user.id}`}
									className="text-base before:absolute before:left-0 before:top-0 before:h-full before:w-full sm:text-lg"
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
			<Link className="my-3 justify-self-center" href="/users">
				<Button tabIndex={-1} variant="outline">
					Show All
				</Button>
			</Link>
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

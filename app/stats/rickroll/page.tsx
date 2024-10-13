import { db } from '@/lib/db';
import ClientPage from './page.client';
import Link from 'next/link';
import { Metadata } from 'next/types';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
	title: 'Last Rickroll | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/'
};

export default async function Page() {
	const lastDate = (
		await db.query(
			`SELECT messages.id as id, messages.created_at as created_at, users.id as user_id, users.user_name as user_name, colors.color_name as color_name FROM messages
		 	LEFT JOIN colors ON messages.color_id = colors.id JOIN users ON messages.user_id = users.id 
		 	WHERE message_text LIKE '%dQw4w9WgXcQ%' 
			ORDER BY created_at + interval '0 second' DESC 
			LIMIT 1`
		)
	).rows[0] as {
		id: number;
		created_at: Date;
		user_id: number;
		color_name: string;
		user_name: string;
	};
	return (
		<div className="mx-5 flex h-full max-w-[100vw] flex-col place-items-center justify-center gap-7 text-center sm:gap-10">
			<p className="break-words text-4xl font-extrabold sm:text-7xl">
				Last Rickroll:
			</p>
			<div className="break-words text-2xl font-extrabold sm:text-4xl">
				<ClientPage time={lastDate.created_at} />
			</div>
			<p className="text-2xl font-extrabold sm:text-4xl">By</p>
			<Link
				href={`/users/${lastDate.user_id}/messages/${lastDate.id}/message-context`}
				style={{
					color: lastDate.color_name
				}}
				className="text-xl font-extrabold text-[var(--highlight)] sm:text-4xl"
			>
				{lastDate.user_name}
			</Link>
			<Link
				target="_blank"
				href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
				className="text-4xl font-extrabold"
			>
				🎙️
			</Link>
		</div>
	);
}

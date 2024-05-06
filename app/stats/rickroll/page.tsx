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
	const lastDate = await db.query(
		`SELECT *, users.user_name, colors.color_name, messages.id FROM messages LEFT JOIN colors ON messages.color_id = colors.id JOIN users ON messages.user_id = users.id  WHERE message_text LIKE '%https://www.youtube.com/watch?v=dQw4w9WgXcQ%' ORDER BY created_at DESC LIMIT 1`
	);
	return (
		<div className="mx-5 flex h-full max-w-[100vw] flex-col place-items-center justify-center gap-7 text-center sm:gap-10">
			<p className="break-words text-4xl font-extrabold sm:text-7xl">
				Last Rickroll:
			</p>
			<div className="break-words text-2xl font-extrabold sm:text-4xl">
				<ClientPage time={lastDate.rows[0].created_at} />
			</div>
			<p className="text-2xl font-extrabold sm:text-4xl">By</p>
			<Link
				href={`/users/${lastDate.rows[0].user_id}/messages/${lastDate.rows[0].id}/message-context`}
				style={{
					color: lastDate.rows[0].color_name
				}}
				className="text-xl font-extrabold text-[var(--highlight)] sm:text-4xl"
			>
				{lastDate.rows[0].user_name}
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

import { db } from '@/lib/db';
import Link from 'next/link';
export const revalidate = 60 * 5;

export default async function Home() {
	const usersCount = await getUsersCount();
	const messagesCount = await getMessagesCount();
	return (
		<div className="prose lg:prose-xl mx-4 flex w-fit max-w-[800px] flex-col gap-5 pb-8 pt-10 text-slate-200 sm:mx-auto sm:w-1/2">
			<h1 className="mb-5 w-full text-4xl font-bold sm:text-6xl">
				Welcome to ArchiveScape
			</h1>
			<section>
				<h2 className="mb-5 w-fit text-xl font-bold sm:text-3xl">
					<span className="relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:border-b-white after:border-opacity-30">
						What is ArchiveScape?
					</span>
				</h2>
				<p className="text-base sm:text-xl">
					ArchiveScape is an open source archive of{' '}
					<a
						className="text-lg font-bold underline underline-offset-4 sm:text-2xl"
						href="https://ventscape.life"
						target="_blank"
					>
						VentScape
					</a>
					. So far, I have archived{' '}
					<Link
						className="text-lg font-bold underline underline-offset-4 sm:text-2xl"
						href="/messages"
					>
						{messagesCount}
					</Link>{' '}
					messages from{' '}
					<Link
						className="text-lg font-bold underline underline-offset-4 sm:text-2xl"
						href="/users"
					>
						{usersCount}
					</Link>{' '}
					unique &quot;users&quot;. The archive was started on April 12, 2024 at
					17:00 UTC. The archive is currently being updated every 5 minutes.
				</p>
			</section>

			<section>
				<h2 className="mb-5 w-fit text-xl font-bold sm:text-3xl">
					<span className="relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:border-b-white after:border-opacity-30">
						Why Create ArchiveScape?
					</span>
				</h2>
				<p className="text-base sm:text-xl">
					You might be wondering, &quot;Doesn&apos;t this website defeat the
					whole purpose of VentScape?&quot; The answer is yes (╥﹏╥), but
					it&apos;s very unlikely that I am the only person recording messages
					from VentScape. Does that justify me also doing it? The answer is no
					(ง ͠ಥ_ಥ)ง, but at least I am making a semi-useful website out of it.
				</p>
			</section>

			<section>
				<h2 className="mb-5 w-fit text-xl font-bold sm:text-3xl">
					<span className="relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-full after:border-b after:border-b-white after:border-opacity-30">
						Project Structure
					</span>
				</h2>
				<p className="text-base sm:text-xl">
					The code of this project is split into two parts: the frontend (this
					website) and the collection script. The frontend is a Next.js app that
					you can find on{' '}
					<a
						className="text-lg font-bold underline underline-offset-4 sm:text-2xl"
						href="https://github.com/LoV432/archivescape"
						target="_blank"
					>
						here
					</a>
					. The collection script is a JS/TS script that runs a Puppeteer
					instance to record messages from the{' '}
					<a
						className="text-lg font-bold underline underline-offset-4 sm:text-2xl"
						href="https://ventscape.life"
						target="_blank"
					>
						VentScape
					</a>{' '}
					website. You can find the code on{' '}
					<a
						className="text-lg font-bold underline underline-offset-4 sm:text-2xl"
						href="https://github.com/LoV432/ventscape-archive"
						target="_blank"
					>
						here
					</a>
					.
				</p>
			</section>
		</div>
	);
}

async function getUsersCount() {
	const count = (await db.query('SELECT COUNT(*) as count FROM users')).rows[0]
		.count;
	console.log(count);
	return count as number;
}

async function getMessagesCount() {
	const count = (await db.query('SELECT COUNT(*) as count FROM messages'))
		.rows[0].count;
	console.log(count);
	return count as number;
}

import LoadingOverlay from '@/components/LoadingOverlay';
import { Suspense } from 'react';
import AllMessagesWithLinks from './page.client';
import { db } from '@/lib/db';
export const dynamic = 'force-dynamic';

export default async function Page() {
	const topDomain = await getTopDomain();
	return (
		<main className="mx-auto flex flex-col gap-3 pt-5">
			<h1 className="text-center text-2xl text-rose-700 sm:text-5xl">
				Most Sent Domain:
			</h1>
			<Suspense fallback={<LoadingOverlay />}>
				<p className="pb-3 text-center text-2xl text-rose-700 sm:text-5xl">
					{topDomain.domain}
				</p>
			</Suspense>
			<AllMessagesWithLinks />
		</main>
	);
}

async function getTopDomain() {
	const messagesWithLinks = (
		await db.query(`SELECT message_text FROM messages WHERE message_text ~ 'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+';
    `)
	).rows as {
		message_text: string;
	}[];

	const links = messagesWithLinks
		.map((row) =>
			row.message_text.match(
				'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+'
			)
		)
		.flat()
		.sort();
	let rankedLinksObject: Record<string, number> = {};
	links.forEach((link) => {
		if (!link) return;
		rankedLinksObject[link.split('/')[2]] =
			(rankedLinksObject[link.split('/')[2]] || 0) + 1;
	});
	const rankedLinks = Object.entries(rankedLinksObject).sort(
		(a, b) => b[1] - a[1]
	);
	return { domain: rankedLinks[0][0], count: rankedLinks[0][1] };
}

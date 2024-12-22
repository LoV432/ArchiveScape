import { db } from './db';

let lastUpdated = 0;
let topDomainCache: { domain: string; count: number } | undefined;
export async function getTopDomain() {
	const now = Date.now();
	if (
		now - lastUpdated < 1000 * 60 * 5 &&
		topDomainCache &&
		topDomainCache.count > 0
	) {
		return {
			domain: topDomainCache.domain,
			count: topDomainCache.count
		};
	}
	lastUpdated = now;
	const messagesWithLinks = (
		await db.query(`SELECT message_text FROM messages WHERE message_text ~ 'http' AND messages.is_deleted = false;
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
	topDomainCache = {
		domain: rankedLinks[0][0],
		count: rankedLinks[0][1]
	};
	return { domain: rankedLinks[0][0], count: rankedLinks[0][1] };
}

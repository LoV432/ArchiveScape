import { db } from './db';

export async function getTopDomain() {
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
	return { domain: rankedLinks[0][0], count: rankedLinks[0][1] };
}

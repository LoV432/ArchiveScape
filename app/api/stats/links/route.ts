import { db } from '@/lib/db';
import { NextRequest } from 'next/server';

export async function GET(Request: NextRequest) {
	const searchParams = Request.nextUrl.searchParams;
	const page = searchParams.get('page') || '0';
	const messagesWithLinks = (
		await db.query(
			`SELECT m.id, message_text, user_id, color_name, created_at FROM messages m LEFT JOIN colors c ON m.color_id = c.id WHERE message_text ~ 'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+' ORDER BY created_at DESC OFFSET $1 LIMIT 10`,
			[Number(page) * 10 - 10]
		)
	).rows as {
		id: number;
		message_text: string;
		created_at: Date;
		color_name: string;
		user_id: number;
	}[];
	const totalPages = Math.ceil(
		(
			await db.query(
				`SELECT COUNT(*) FROM messages WHERE message_text ~ 'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+'`
			)
		).rows[0]['count'] / 10
	);
	return new Response(
		JSON.stringify({ links: messagesWithLinks, totalPages }),
		{
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		}
	);
}

export async function getTopDomain() {
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

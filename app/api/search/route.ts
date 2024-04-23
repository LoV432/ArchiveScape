import { db } from '@/lib/db';
import { NextRequest } from 'next/server';

export async function GET(Request: NextRequest) {
	const { searchParams } = Request.nextUrl;
	const searchQuery = searchParams.get('search');
	const page = searchParams.get('page') || '0';
	if (!searchQuery || searchQuery === '') {
		return new Response(JSON.stringify({ error: 'Missing searchQuery' }), {
			status: 500
		});
	}
	try {
		const messages = await db.query(
			`SELECT messages.id, message_text, created_at, colors.color_name, messages.user_id FROM messages LEFT JOIN colors ON messages.color_id = colors.id WHERE message_text LIKE $1 ORDER BY created_at DESC LIMIT 10 OFFSET $2`,
			[`%${searchQuery}%`, (Number(page) - 1) * 10]
		);
		const totalPages = Math.ceil(
			(
				await db.query(
					`SELECT COUNT(*) FROM messages WHERE message_text LIKE $1`,
					[`%${searchQuery}%`]
				)
			).rows[0]['count'] / 10
		);
		return new Response(JSON.stringify({ messages: messages.rows, totalPages }));
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify([]), { status: 500 });
	}
}

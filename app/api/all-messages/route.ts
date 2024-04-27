import { db } from '@/lib/db';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const page = searchParams.get('page') || '0';
	const messages = await db.query(
		`SELECT messages.id, message_text, created_at, colors.color_name, messages.user_id
        FROM messages 
        LEFT JOIN colors ON messages.color_id = colors.id 
        ORDER BY created_at DESC
        OFFSET $1 LIMIT 10`,
		[Number(page) * 10 - 10]
	);
	const totalPages = Math.ceil(
		(await db.query('SELECT COUNT(*) FROM messages')).rows[0]['count'] / 10
	);
	return new Response(JSON.stringify({ messages: messages.rows, totalPages }));
}

import { getDatabase } from '@/lib/db';
import { NextRequest } from 'next/server';

export async function GET(NextRequest: NextRequest) {
	const { searchParams } = NextRequest.nextUrl;
	const userId = searchParams.get('userId');
	const page = searchParams.get('page') || '0';
	if (!userId || userId === '') {
		return new Response(JSON.stringify({ error: 'Missing userId' }), {
			status: 500
		});
	}
	const db = await getDatabase();
	try {
		const messages = await db.all(
			`SELECT messageText, createdAt, colors.color FROM messages JOIN colors ON messages.color = colors.id WHERE userId = (SELECT id FROM users_id WHERE userId = ?) ORDER BY createdAt DESC LIMIT 10 OFFSET ?`,
			[userId, (Number(page) - 1) * 10]
		);
		const totalPages = Math.ceil(
			(
				await db.get(
					`SELECT COUNT(*) FROM messages WHERE userId = (SELECT id FROM users_id WHERE userId = ?)`,
					[userId]
				)
			)['COUNT(*)'] / 10
		);
		return new Response(JSON.stringify({ messages, totalPages }));
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify([]), { status: 500 });
	}
}

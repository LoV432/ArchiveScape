import { db } from '@/lib/db';
import { NextRequest } from 'next/server';

export async function GET(NextRequest: NextRequest) {
	const { searchParams } = NextRequest.nextUrl;
	const userId = searchParams.get('userId');
	const page = searchParams.get('page') || '0';
	if (!userId || userId === '' || isNaN(Number(userId))) {
		return new Response(JSON.stringify({ error: 'Missing userId' }), {
			status: 500
		});
	}
	try {
		const messages = await db.query(
			`SELECT messages.id, message_text, created_at, colors.color_name FROM messages LEFT JOIN colors ON messages.color_id = colors.id WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10 OFFSET $2`,
			[userId, (Number(page) - 1) * 10]
		);
		const totalPages = Math.ceil(
			(
				await db.query(`SELECT COUNT(*) FROM messages WHERE user_id = $1`, [
					userId
				])
			).rows[0]['count'] / 10
		);
		const user = await db.query(`SELECT user_name FROM users WHERE id = $1`, [
			userId
		]);
		return new Response(
			JSON.stringify({
				messages: messages.rows,
				totalPages,
				user_name: user.rows[0].user_name
			})
		);
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify([]), { status: 500 });
	}
}

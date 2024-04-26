import { db } from '@/lib/db';
import { NextRequest } from 'next/server';

export async function GET(Request: NextRequest) {
	const { searchParams } = Request.nextUrl;
	const userId = searchParams.get('userId');
	const messageId = searchParams.get('messageId');
	const page = searchParams.get('page') || '0';
	if (!userId || userId === '' || isNaN(Number(userId))) {
		return new Response(JSON.stringify({ error: 'Missing userId' }), {
			status: 500
		});
	}
	if (!messageId || messageId === '' || isNaN(Number(messageId))) {
		return new Response(JSON.stringify({ error: 'Missing messageId' }), {
			status: 500
		});
	}

	try {
		// Get the row number of the message. This is used to determine what page the message is on
		// We are using row instead of id because id can have gaps in it
		const messageIndex = await db.query(
			`SELECT message_index FROM (SELECT messages.id, ROW_NUMBER() OVER (ORDER BY created_at ASC) AS message_index FROM messages) AS messages WHERE messages.id = $1`,
			[Number(messageId)]
		);
		// Once we have the row number we can determine what page it is on
		const messagePage = Math.ceil(
			messageIndex.rows[0]['message_index'] / 10 - 1
		);
		// Then we minus or plus the page number requested by the user to get the offset
		const offset = messagePage * 10 + (Number(page) - 1) * 10;
		// Then we can get the messages for that page
		const messages = await db.query(
			`SELECT messages.id, message_text, created_at, colors.color_name, user_id FROM messages LEFT JOIN colors ON messages.color_id = colors.id ORDER BY created_at ASC LIMIT 10 OFFSET $1`,
			[offset]
		);
		const user = await db.query(`SELECT user_name FROM users WHERE id = $1`, [
			userId
		]);
		return new Response(
			JSON.stringify({
				messages: messages.rows,
				user_name: user.rows[0].user_name
			}),
			{
				headers: { 'Content-Type': 'application/json' },
				status: 200
			}
		);
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify([]), { status: 500 });
	}
}

import { getDatabase } from '@/lib/db';
import { NextRequest } from 'next/server';

export async function GET(Request: NextRequest) {
	const { searchParams } = Request.nextUrl;
	const userId = searchParams.get('userId');
	const messageId = searchParams.get('messageId');
	const page = searchParams.get('page') || '0';
	if (!userId || userId === '') {
		return new Response(JSON.stringify({ error: 'Missing userId' }), {
			status: 500
		});
	}
	if (!messageId || messageId === '' || isNaN(Number(messageId))) {
		return new Response(JSON.stringify({ error: 'Missing messageId' }), {
			status: 500
		});
	}
	const db = await getDatabase();

	try {
		// Get the row number of the message. This is used to determine what page the message is on
		// We are using row instead of id because id can have gaps in it
		const messageIndex = await db.get(
			`SELECT messageIndex FROM (SELECT messages.id, ROW_NUMBER() OVER (ORDER BY createdAt ASC) AS messageIndex FROM messages) AS messages WHERE messages.id = ?`,
			[Number(messageId)]
		);
		// Once we have the row number we can determine what page it is on
		const messagePage = Math.ceil(messageIndex['messageIndex'] / 10 - 1);
		// Then we minus or plus the page number requested by the user to get the offset
		const offset = messagePage * 10 + (Number(page) - 1) * 10;
		// Then we can get the messages for that page
		const messages = await db.all(
			`SELECT messages.id, messageText, createdAt, colors.color, userId FROM messages LEFT JOIN colors ON messages.color = colors.id ORDER BY createdAt ASC LIMIT 10 OFFSET ?`,
			[offset]
		);
		const userRelationId = await db.get(
			`SELECT users_id.id FROM users_id WHERE userId = ?`,
			[userId]
		);
		return new Response(JSON.stringify({ messages, userRelationId }), {
			headers: { 'Content-Type': 'application/json' },
			status: 200
		});
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify([]), { status: 500 });
	}
}

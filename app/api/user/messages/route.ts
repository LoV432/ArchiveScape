import { getDatabase } from '@/lib/db';
import { NextRequest } from 'next/server';

export async function GET(NextRequest: NextRequest) {
	const { searchParams } = NextRequest.nextUrl;
	const userId = searchParams.get('userId');
	if (!userId || userId === '') {
		return new Response(JSON.stringify({ error: 'Missing userId' }), {
			status: 500
		});
	}
	const db = await getDatabase();
	try {
		const messages = await db.all(
			`SELECT id, messageText, createdAt FROM messages WHERE userId = (SELECT id FROM users_id WHERE userId = ?) ORDER BY createdAt ASC LIMIT 10`,
			[userId]
		);
		return new Response(JSON.stringify(messages));
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify([]), { status: 500 });
	}
}

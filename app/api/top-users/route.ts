import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function GET() {
	try {
		const db = await open({
			filename: './database.db',
			driver: sqlite3.Database
		});
		const messages = await db.all(`
			SELECT u.userId, COUNT(*) AS messageCount
			FROM messages m
			JOIN users_id u ON m.userId = u.id
			GROUP BY u.userId
			ORDER BY messageCount DESC
			LIMIT 10`);
		return new Response(JSON.stringify(messages));
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify([]), { status: 500 });
	}
}

import { db } from '@/lib/db';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const page = searchParams.get('page') || '0';
	const usersWithMessagesCount = await db.query(
		`SELECT users.id, users.user_name, COUNT(*) AS message_count
        FROM users
        INNER JOIN messages m ON m.user_id = users.id
        GROUP BY users.id, users.user_name ORDER BY message_count DESC, users.user_name DESC OFFSET $1 LIMIT 10;`,
		[Number(page) * 10 - 10]
	);

	const totalPages = Math.ceil(
		(await db.query('SELECT COUNT(*) FROM users')).rows[0]['count'] / 10
	);
	return new Response(
		JSON.stringify({ users: usersWithMessagesCount.rows, totalPages })
	);
}

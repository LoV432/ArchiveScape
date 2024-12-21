import { db } from '@/lib/db';

export type User = {
	id: number;
	user_name: string;
	message_count: number;
};

export async function getAllUsers(page: number) {
	const itemsPerPage = Number(process.env.ITEMS_PER_PAGE) || 10;
	const usersWithMessagesCount = await db.query(
		// TODO: Pagination will be an issue now that we are not sorting by total message count and showing most recent first
		// We might need to do some DB pinning for this too or we could simply do cursor pagination
		`SELECT u.user_name, m.message_count, m.user_id as id
			FROM users u
			INNER JOIN (
				SELECT COUNT(*) AS message_count, user_id
				FROM messages
				GROUP BY user_id
			) m ON u.id = m.user_id
			ORDER BY u.id DESC
			OFFSET $1
			LIMIT $2;`,
		[Number(page) * itemsPerPage - itemsPerPage, itemsPerPage]
	);
	return { users: usersWithMessagesCount.rows as User[] };
}

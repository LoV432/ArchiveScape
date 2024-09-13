import { db } from '@/lib/db';

export type User = {
	id: number;
	user_name: string;
	message_count: number;
};

export async function getAllUsers(page: number) {
	const itemsPerPage = Number(process.env.ITEMS_PER_PAGE) || 10;
	const usersWithMessagesCount = await db.query(
		`SELECT u.user_name, m.message_count, m.user_id as id
			FROM users u
			INNER JOIN (
				SELECT COUNT(*) AS message_count, user_id
				FROM messages
				GROUP BY user_id
				ORDER BY message_count desc
				OFFSET $1
				LIMIT $2
			) m ON u.id = m.user_id
			ORDER BY m.message_count DESC;`,
		[Number(page) * itemsPerPage - itemsPerPage, itemsPerPage]
	);
	return { users: usersWithMessagesCount.rows as User[] };
}

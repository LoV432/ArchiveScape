import { db } from '@/lib/db';

export type User = {
	id: number;
	user_name: string;
	message_count: number;
};

export async function getAllUsers(page: number) {
	const itemsPerPage = Number(process.env.ITEMS_PER_PAGE) || 10;
	const usersWithMessagesCount = await db.query(
		`SELECT users.id, users.user_name, COUNT(*) AS message_count
        FROM users
        INNER JOIN messages m ON m.user_id = users.id
        GROUP BY users.id, users.user_name ORDER BY message_count DESC, users.user_name DESC OFFSET $1 LIMIT $2;`,
		[Number(page) * itemsPerPage - itemsPerPage, itemsPerPage]
	);

	const totalPages = Math.ceil(
		(await db.query('SELECT COUNT(*) FROM users')).rows[0]['count'] /
			itemsPerPage
	);
	return { users: usersWithMessagesCount.rows as User[], totalPages };
}

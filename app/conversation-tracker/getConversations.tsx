import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { addOrderBy, addOffsetLimit, addLocalLastId } from '@/lib/db-helpers';
import { Message } from '@/lib/all-messages';

export default async function getConversations(users: number[], page: number) {
	try {
		const itemsPerPage = Number(process.env.ITEMS_PER_PAGE) || 10;
		const offset = Number(page) * itemsPerPage - itemsPerPage;
		const localLastId =
			Number((await cookies()).get('localLastId')?.value) || undefined;
		let messagesQuery = `SELECT messages.id as id, user_id, message_text, created_at, colors.color_name, nickname
			FROM messages 
			LEFT JOIN colors ON messages.color_id = colors.id 
			WHERE user_id = ANY($1::int[]) AND messages.is_deleted = false`;
		let messagesParams: any[] = [users];

		if (localLastId) {
			messagesQuery = addLocalLastId({
				query: messagesQuery,
				paramsList: messagesParams,
				localLastId
			});
		}
		messagesQuery = addOrderBy({
			query: messagesQuery,
			orderBy: 'created_at DESC'
		});
		messagesQuery = addOffsetLimit({
			query: messagesQuery,
			paramsList: messagesParams,
			offset,
			limit: itemsPerPage
		});
		//console.log(messagesQuery, messagesParams);
		const messages = (await db.query(messagesQuery, messagesParams))
			.rows as Message[];

		let countQuery =
			'SELECT COUNT(*) FROM messages WHERE user_id = ANY($1::int[]) AND messages.is_deleted = false';
		let countParams: any[] = [users];
		if (localLastId) {
			countQuery = addLocalLastId({
				query: countQuery,
				paramsList: countParams,
				localLastId
			});
		}
		const totalPages = Math.ceil(
			(await db.query(countQuery, countParams)).rows[0]['count'] / itemsPerPage
		);

		return { messages, totalPages };
	} catch (error) {
		console.error(error);
		return { messages: [], totalPages: 0 };
	}
}

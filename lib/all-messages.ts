import { db } from './db';
import { cookies } from 'next/headers';
import { addLocalLastId, addOffsetLimit, addOrderBy } from './db-helpers';

export type Message = {
	id: number;
	created_at: string;
	message_text: string;
	user_id: number;
	color_name: string;
};

export async function getAllMessages(page: number) {
	const itemsPerPage = Number(process.env.ITEMS_PER_PAGE) || 10;
	const offset = Number(page) * itemsPerPage - itemsPerPage;
	const localLastId = Number(cookies().get('localLastId')?.value) || undefined;
	let queryBuilder = `SELECT messages.id, message_text, created_at, colors.color_name, messages.user_id
						FROM messages 
						LEFT JOIN colors ON messages.color_id = colors.id`;
	let paramsList = [] as any[];
	if (localLastId) {
		queryBuilder = addLocalLastId({
			query: queryBuilder,
			paramsList,
			localLastId: localLastId
		});
	}
	queryBuilder = addOrderBy({
		query: queryBuilder,
		orderBy: 'created_at DESC'
	});
	queryBuilder = addOffsetLimit({
		query: queryBuilder,
		paramsList,
		offset,
		limit: itemsPerPage
	});
	const messages = await db.query(queryBuilder, paramsList);

	let countQueryBuilder = `SELECT COUNT(*) FROM messages`;
	let countParamsList = [] as any[];
	if (localLastId) {
		countQueryBuilder = addLocalLastId({
			query: countQueryBuilder,
			paramsList: countParamsList,
			localLastId: localLastId
		});
	}
	const totalPages = Math.ceil(
		(await db.query(countQueryBuilder, countParamsList)).rows[0]['count'] /
			itemsPerPage
	);
	return { messages: messages.rows as Message[], totalPages };
}

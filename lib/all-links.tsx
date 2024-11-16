import { db } from '@/lib/db';
import { Message } from './all-messages';
import { cookies } from 'next/headers';
import { addLocalLastId, addOffsetLimit, addOrderBy } from './db-helpers';

export async function getAllLinks(page: number) {
	const itemsPerPage = Number(process.env.ITEMS_PER_PAGE) || 10;
	const offset = Number(page) * itemsPerPage - itemsPerPage;
	const localLastId =
		Number((await cookies()).get('localLastId')?.value) || undefined;
	let queryBuilder = `SELECT messages.id, message_text, created_at, colors.color_name, messages.user_id
						FROM messages 
						LEFT JOIN colors ON messages.color_id = colors.id WHERE message_text ~ 'http' AND messages.is_deleted = false`;
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
	const messagesWithLinks = (await db.query(queryBuilder, paramsList))
		.rows as Message[];

	let countQueryBuilder = `SELECT COUNT(*) FROM messages WHERE message_text ~ 'http' AND messages.is_deleted = false`;
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
	return {
		links: messagesWithLinks,
		totalPages
	};
}

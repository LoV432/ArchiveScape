'use server';

import { db } from './db';
import { cookies } from 'next/headers';
import {
	addDateRange,
	addLocalLastId,
	addOffsetLimit,
	addOrderBy
} from './db-helpers';

export type Message = {
	id: number;
	created_at: string;
	message_text: string;
	user_id: number;
	color_name: string;
};

export async function getAllMessages(
	page: number,
	order: 'asc' | 'desc' = 'desc',
	dateStart?: Date,
	dateEnd?: Date
) {
	if (page > 500) return { messages: [] }; // Its very expensive to query pages above 500
	const itemsPerPage = Number(process.env.ITEMS_PER_PAGE) || 10;
	const offset = Number(page) * itemsPerPage - itemsPerPage;
	const localLastId = Number(cookies().get('localLastId')?.value) || undefined;
	let queryBuilder = `SELECT messages.id, message_text, created_at, colors.color_name, messages.user_id
						FROM messages
						LEFT JOIN colors ON messages.color_id = colors.id
						WHERE messages.is_deleted = false`;
	let paramsList = [] as any[];
	if (localLastId) {
		queryBuilder = addLocalLastId({
			query: queryBuilder,
			paramsList,
			localLastId: localLastId
		});
	}
	if (dateStart || dateEnd) {
		queryBuilder = addDateRange({
			query: queryBuilder,
			params: paramsList,
			dateStart,
			dateEnd
		});
	}
	queryBuilder = addOrderBy({
		query: queryBuilder,
		orderBy: `created_at ${order}`
	});
	queryBuilder = addOffsetLimit({
		query: queryBuilder,
		paramsList,
		offset,
		limit: itemsPerPage
	});
	const messages = await db.query(queryBuilder, paramsList);
	return { messages: messages.rows as Message[] };
}

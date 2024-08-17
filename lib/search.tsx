import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import {
	addDateRange,
	addLocalLastId,
	addOffsetLimit,
	addOrderBy
} from './db-helpers';

export async function getSearch(
	searchQuery: string,
	page: number,
	dateStart?: Date,
	dateEnd?: Date,
	order: 'asc' | 'desc' = 'desc'
) {
	if (!searchQuery || searchQuery === '') {
		return { success: true as const, messages: [], totalPages: 0 };
	}
	const itemsPerPage = Number(process.env.ITEMS_PER_PAGE) || 10;
	const offset = Number(page) * itemsPerPage - itemsPerPage;
	const localLastId = Number(cookies().get('localLastId')?.value) || undefined;
	try {
		// Build get messages query
		let queryBuilder = `SELECT messages.id, message_text, created_at, colors.color_name, messages.user_id FROM messages LEFT JOIN colors ON messages.color_id = colors.id WHERE message_text ILIKE $1`;
		let params: any[] = [`%${searchQuery}%`];
		if (dateStart || dateEnd) {
			queryBuilder = addDateRange({
				query: queryBuilder,
				params: params,
				dateStart,
				dateEnd
			});
		}
		if (localLastId) {
			queryBuilder = addLocalLastId({
				query: queryBuilder,
				paramsList: params,
				localLastId: localLastId
			});
		}
		queryBuilder = addOrderBy({
			query: queryBuilder,
			orderBy: `created_at ${order}`
		});
		queryBuilder = addOffsetLimit({
			query: queryBuilder,
			paramsList: params,
			offset,
			limit: itemsPerPage
		});
		const messages = await db.query(queryBuilder, params);

		// Build total pages query
		let totalPagesQuery = `SELECT COUNT(*) FROM messages WHERE message_text ILIKE $1`;
		params = [`%${searchQuery}%`];
		if (dateStart || dateEnd) {
			totalPagesQuery = addDateRange({
				query: totalPagesQuery,
				params: params,
				dateStart,
				dateEnd
			});
		}
		if (localLastId) {
			totalPagesQuery = addLocalLastId({
				query: totalPagesQuery,
				paramsList: params,
				localLastId: localLastId
			});
		}
		const totalPages = Math.ceil(
			(await db.query(totalPagesQuery, params)).rows[0]['count'] / itemsPerPage
		);
		return {
			success: true as const,
			messages: messages.rows,
			totalPages
		};
	} catch (error) {
		console.log(error);
		return {
			success: false as const,
			error: 'Something went wrong. Please try again later.'
		};
	}
}

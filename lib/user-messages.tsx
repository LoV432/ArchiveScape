import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import {
	addDateRange,
	addLocalLastId,
	addOffsetLimit,
	addOrderBy
} from './db-helpers';

export async function getUserMessages(
	userId: number,
	page: number,
	order: 'asc' | 'desc' = 'desc',
	dateStart?: Date,
	dateEnd?: Date
) {
	const itemsPerPage = Number(process.env.ITEMS_PER_PAGE) || 10;
	const offset = Number(page) * itemsPerPage - itemsPerPage;
	const localLastId = Number(cookies().get('localLastId')?.value) || undefined;
	try {
		const user = await db.query(`SELECT user_name FROM users WHERE id = $1`, [
			userId
		]);
		if (user.rows.length === 0) {
			return {
				success: false as const,
				error: 'User not found'
			};
		}
		let queryBuilder = `SELECT messages.id, message_text, created_at, colors.color_name FROM messages LEFT JOIN colors ON messages.color_id = colors.id WHERE user_id = $1 AND messages.is_deleted = false`;
		let paramsList = [userId] as any[];
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

		let countQueryBuilder = `SELECT COUNT(*) FROM messages WHERE user_id = $1 AND messages.is_deleted = false`;
		let countParamsList = [userId] as any[];
		if (localLastId) {
			countQueryBuilder = addLocalLastId({
				query: countQueryBuilder,
				paramsList: countParamsList,
				localLastId: localLastId
			});
		}
		if (dateStart || dateEnd) {
			countQueryBuilder = addDateRange({
				query: countQueryBuilder,
				params: countParamsList,
				dateStart,
				dateEnd
			});
		}
		const totalPages = Math.ceil(
			(await db.query(countQueryBuilder, countParamsList)).rows[0]['count'] /
				itemsPerPage
		);
		return {
			success: true as const,
			messages: messages.rows,
			totalPages,
			user_name: user.rows[0].user_name
		};
	} catch (error) {
		console.log(error);
		return {
			success: false as const,
			error: 'Something went wrong. Please try again later.'
		};
	}
}

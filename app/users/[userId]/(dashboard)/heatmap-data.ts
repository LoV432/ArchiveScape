import { db } from '@/lib/db';

export type HeatmapData = ReturnType<typeof getHeatmapData>;

export async function getHeatmapData(userId: number, startingYear?: number) {
	try {
		const yearsQuery = `SELECT DISTINCT EXTRACT(YEAR FROM created_at) as year
		FROM messages 
		WHERE user_id = $1
		ORDER BY EXTRACT(YEAR FROM created_at) DESC`;
		const years = (await db.query(yearsQuery, [userId])).rows.map(
			(row) => row.year
		) as string[];
		const startDate = new Date(
			startingYear || Number(years[0]),
			0,
			1
		).toISOString();
		const endDate = new Date(
			startingYear || Number(years[0]),
			11,
			32 // TODO: This is 32 to make sure the last day of the year is included. I am not sure if this is safe or not tho.
		).toISOString();
		const query = `SELECT COUNT(date_trunc('day', created_at)) as count, date_trunc('day', created_at) as date
                        FROM messages 
                        WHERE user_id = $1
                        AND created_at >= $2
						AND created_at <= $3
                        GROUP BY date_trunc('day', created_at)
                        ORDER BY date_trunc('day', created_at)`;
		const result = (await db.query(query, [userId, startDate, endDate]))
			.rows as { count: number; date: Date }[];
		return { years, data: result };
	} catch (error) {
		console.error(error);
		return { years: [], data: [] };
	}
}

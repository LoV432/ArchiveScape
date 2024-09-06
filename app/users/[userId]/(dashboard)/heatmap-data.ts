import { db } from '@/lib/db';

export type HeatmapData = {
	count: number;
	date: Date;
}[];

export async function getHeatmapData(userId: number) {
	try {
		const startDate = new Date(new Date().getFullYear(), 0, 1);
		const query = `SELECT COUNT(date_trunc('day', created_at)) as count, date_trunc('day', created_at) as date
                        FROM messages 
                        WHERE user_id = $1
                        AND created_at >= $2
                        GROUP BY date_trunc('day', created_at)
                        ORDER BY date_trunc('day', created_at)`;
		const result = (await db.query(query, [userId, startDate.toISOString()]))
			.rows as HeatmapData;
		return result;
	} catch (error) {
		console.error(error);
		return [];
	}
}

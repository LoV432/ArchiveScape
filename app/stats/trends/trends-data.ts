import { db } from '@/lib/db';
import { DateTime } from 'luxon';
export type TrendsData = {
	word: string;
	word_data: {
		message_count: string;
		day: string;
	}[];
}[];

export async function getTrendsData(words: string[]) {
	if (words.length === 0) return [];
	if (words.length > 5) words = words.slice(0, 5);
	try {
		let data: TrendsData = [];
		const sevenMonthsAgo = DateTime.now().minus({ months: 6 }).toISO();
		await Promise.all(
			words.map(async (word) => {
				const queryData = await db.query(
					`SELECT COUNT(*) AS message_count, DATE_TRUNC('day', created_at) AS day
		            FROM messages
		            WHERE message_text ILIKE $1 AND created_at >= $2
		            GROUP BY day
		            ORDER BY day ASC;`,
					[`% ${word} %`, sevenMonthsAgo]
				);
				data.push({
					word,
					word_data: queryData.rows as { message_count: string; day: string }[]
				});
			})
		);
		return data;
	} catch (error) {
		console.error(error);
		return [];
	}
}

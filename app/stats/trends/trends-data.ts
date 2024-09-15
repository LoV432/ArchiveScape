import { db } from '@/lib/db';
export type TrendsData = {
	word: string;
	word_data: {
		message_count: string;
		month: string;
	}[];
}[];

export async function getTrendsData(words: string[]) {
	if (words.length === 0) return [];
	if (words.length > 5) words = words.slice(0, 5);
	try {
		let data: TrendsData = [];
		const sevenMonthsAgo = new Date();
		sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 6);
		for (const word of words) {
			const queryData = await db.query(
				`SELECT COUNT(*) AS message_count, DATE_TRUNC('month', created_at) AS month
                    FROM messages
                    WHERE message_text ILIKE $1 AND created_at >= $2
                    GROUP BY month
                    ORDER BY month ASC;`,
				[`% ${word} %`, sevenMonthsAgo.toISOString()]
			);
			data.push({
				word,
				word_data: queryData.rows as { message_count: string; month: string }[]
			});
		}
		return data;
	} catch (error) {
		console.error(error);
		return [];
	}
}

import { db } from './db';

export async function getDailyUsage() {
	let messagesCount: {
		date: string;
		messages: number;
	}[] = [];
	for (let i = 0; i < 21; i++) {
		const date = new Date(new Date().setDate(new Date().getDate() - (20 - i)))
			.toISOString()
			.split('T')[0];
		const messages = (
			await db.query(
				'SELECT COUNT(id) as count FROM messages where created_at > $1 AND created_at < $2',
				[date + ' 00:00:00', date + ' 23:59:59']
			)
		).rows[0].count;
		const formatedDate = new Date(date)
			.toLocaleDateString('en-US', {
				month: '2-digit',
				day: '2-digit'
			})
			.toString();
		messagesCount.push({ date: formatedDate, messages });
	}
	return messagesCount;
}

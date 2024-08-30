import { Message } from '@/lib/all-messages';
import { db } from '@/lib/db';

export async function getUserName(userId: number) {
	try {
		const query = `SELECT user_name FROM users WHERE id = $1`;
		const userName = (await db.query(query, [userId])).rows[0]
			.user_name as string;
		return userName;
	} catch (error) {
		console.error('Error fetching user name:', error);
		return null;
	}
}

export async function getFirstLastSeen(userId: number) {
	try {
		const query = `
        (
            SELECT created_at from messages
            WHERE user_id = $1
            ORDER BY created_at ASC
            LIMIT 1
        )
             UNION ALL
        (
            SELECT created_at from messages
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT 1
        ) 
        `;
		const firstLastSeen = (await db.query(query, [userId])).rows as [
			{ created_at: Date },
			{ created_at: Date }
		];
		return {
			firstSeen: firstLastSeen[0].created_at,
			lastSeen: firstLastSeen[1].created_at
		};
	} catch (error) {
		console.error('Error fetching first and last seen:', error);
		return null;
	}
}

export async function getTotalMessages(userId: number) {
	try {
		const query = `SELECT COUNT(*) FROM messages WHERE user_id = $1`;
		const totalMessages = (await db.query(query, [userId])).rows[0]
			.count as number;
		return totalMessages;
	} catch (error) {
		console.error('Error fetching total messages:', error);
		return null;
	}
}

export async function getRecentMessages(userId: number) {
	try {
		const query = `
        SELECT messages.id as id, created_at, message_text, user_id, color_name FROM messages
        LEFT JOIN colors ON messages.color_id = colors.id
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 10
        `;
		const recentMessages = (await db.query(query, [userId])).rows as Message[];
		return recentMessages;
	} catch (error) {
		console.error('Error fetching recent messages:', error);
		return null;
	}
}

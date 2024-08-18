import { db } from '@/lib/db';
import { Message } from './all-messages';

export async function getMessageContext(
	userId: number,
	messageId: number,
	page: number
) {
	try {
		//TODO: Use the global messages per page limit instead of hardcoded 40
		const anchorMessage = await db.query(
			`SELECT messages.id, created_at, user_id, user_name FROM messages JOIN users ON messages.user_id = users.id WHERE messages.id = $1 AND users.id = $2`,
			[messageId, userId]
		);
		if (anchorMessage.rows.length === 0) {
			return {
				success: false as const,
				error: 'Message or user not found'
			};
		}
		const anchorMessageCreatedAt = anchorMessage.rows[0].created_at;
		if (page === 0) {
			return {
				success: true as const,
				messages: await getFirstPage(
					anchorMessageCreatedAt,
					anchorMessage.rows[0].id
				),
				user_name: anchorMessage.rows[0].user_name
			};
		} else if (page < 0) {
			return {
				success: true as const,
				messages: await getNegativePage(
					anchorMessageCreatedAt,
					anchorMessage.rows[0].id,
					page
				),
				user_name: anchorMessage.rows[0].user_name
			};
		} else {
			return {
				success: true as const,
				messages: await getPositivePage(
					anchorMessageCreatedAt,
					anchorMessage.rows[0].id,
					page
				),
				user_name: anchorMessage.rows[0].user_name
			};
		}
	} catch (error) {
		console.log(error);
		return {
			success: false as const,
			error: 'Something went wrong. Please try again later.'
		};
	}
}

async function getFirstPage(
	anchorMessageCreatedAt: Date,
	anchorMessageId: number
) {
	const query = `
        (
            SELECT messages.id, created_at, user_id, message_text, color_name FROM messages
			LEFT JOIN colors ON messages.color_id = colors.id
            WHERE created_at <= $2 AND messages.id < $1
            ORDER BY created_at DESC, messages.id DESC
            LIMIT 20
        )
        UNION ALL
        (
            SELECT messages.id, created_at, user_id, message_text, color_name FROM messages
			LEFT JOIN colors ON messages.color_id = colors.id
            WHERE created_at >= $2 AND messages.id >= $1
            ORDER BY created_at ASC, messages.id ASC
            LIMIT 20
        )
        ORDER BY created_at ASC;
    `;
	const params = [anchorMessageId, anchorMessageCreatedAt];
	return (await db.query(query, params)).rows as Message[];
}

async function getNegativePage(
	anchorMessageCreatedAt: Date,
	anchorMessageId: number,
	page: number
) {
	const offset = Math.abs(page + 1) * 40 + 20;
	const query = `SELECT messages.id, created_at, user_id, message_text, color_name FROM messages
					LEFT JOIN colors ON messages.color_id = colors.id
					WHERE created_at <= $1 AND messages.id < $2
            		ORDER BY created_at DESC, messages.id DESC
					OFFSET $3
            		LIMIT 40`;
	const params = [anchorMessageCreatedAt, anchorMessageId, offset];
	return (await db.query(query, params)).rows.reverse() as Message[];
}

async function getPositivePage(
	anchorMessageCreatedAt: Date,
	anchorMessageId: number,
	page: number
) {
	const offset = (page - 1) * 40 + 20;
	const query = `SELECT messages.id, created_at, user_id, message_text, color_name FROM messages
					LEFT JOIN colors ON messages.color_id = colors.id
					WHERE created_at >= $1 AND messages.id >= $2
            		ORDER BY created_at ASC, messages.id ASC
					OFFSET $3
            		LIMIT 40`;
	const params = [anchorMessageCreatedAt, anchorMessageId, offset];
	return (await db.query(query, params)).rows as Message[];
}

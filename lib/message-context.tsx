import { db } from '@/lib/db';
import { Message } from './all-messages';

export type getMessageContextResponse = ReturnType<typeof getMessageContext>;

export async function getMessageContext(
	userId: number,
	messageId: number,
	page: number
) {
	try {
		//TODO: Use the global messages per page limit instead of hardcoded 40
		const anchorMessage = await db.query(
			`SELECT messages.id, created_at, user_id, user_name FROM messages JOIN users ON messages.user_id = users.id WHERE messages.id = $1 AND users.id = $2 AND messages.is_deleted = false`,
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
				messages: await getFirstPage(anchorMessageCreatedAt),
				user_name: anchorMessage.rows[0].user_name
			};
		} else if (page < 0) {
			return {
				success: true as const,
				messages: await getNegativePage(anchorMessageCreatedAt, page),
				user_name: anchorMessage.rows[0].user_name
			};
		} else {
			return {
				success: true as const,
				messages: await getPositivePage(anchorMessageCreatedAt, page),
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

async function getFirstPage(anchorMessageCreatedAt: Date) {
	// TODO: I am just too dumb for this query. Hopefully this attempt will work.
	// I am completely removing the anchorMessageId from the query.
	// I am not trying to anchor to the message anymore because I don't know how to do that.
	// I am now just anchoring to a specific date.
	const query = `
        (
            SELECT messages.id, created_at, user_id, message_text, color_name, nicknames.nickname_name as nickname FROM messages
			LEFT JOIN colors ON messages.color_id = colors.id
			LEFT JOIN nicknames ON messages.nickname_id = nicknames.id
            WHERE created_at <= $1 AND messages.is_deleted = false
            ORDER BY created_at DESC
            LIMIT 20
        )
        UNION ALL
        (
            SELECT messages.id, created_at, user_id, message_text, color_name, nicknames.nickname_name as nickname FROM messages
			LEFT JOIN colors ON messages.color_id = colors.id
			LEFT JOIN nicknames ON messages.nickname_id = nicknames.id
            WHERE created_at > $1 AND messages.is_deleted = false
            ORDER BY created_at ASC
            LIMIT 20
        )
        ORDER BY created_at ASC;
    `;
	const params = [anchorMessageCreatedAt];
	return (await db.query(query, params)).rows as Message[];
}

async function getNegativePage(anchorMessageCreatedAt: Date, page: number) {
	const offset = Math.abs(page + 1) * 40 + 20;
	const query = `SELECT messages.id, created_at, user_id, message_text, color_name, nicknames.nickname_name as nickname FROM messages
					LEFT JOIN colors ON messages.color_id = colors.id
					LEFT JOIN nicknames ON messages.nickname_id = nicknames.id
					WHERE created_at <= $1 AND messages.is_deleted = false
            		ORDER BY created_at DESC
					OFFSET $2
            		LIMIT 40`;
	const params = [anchorMessageCreatedAt, offset];
	return (await db.query(query, params)).rows.reverse() as Message[];
}

async function getPositivePage(anchorMessageCreatedAt: Date, page: number) {
	const offset = (page - 1) * 40 + 20;
	const query = `SELECT messages.id, created_at, user_id, message_text, color_name, nicknames.nickname_name as nickname FROM messages
					LEFT JOIN colors ON messages.color_id = colors.id
					LEFT JOIN nicknames ON messages.nickname_id = nicknames.id
					WHERE created_at > $1  AND messages.is_deleted = false
            		ORDER BY created_at ASC
					OFFSET $2
            		LIMIT 40`;
	const params = [anchorMessageCreatedAt, offset];
	return (await db.query(query, params)).rows as Message[];
}

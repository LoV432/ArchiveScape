import { db } from '@/lib/db';
import { Message } from './all-messages';

export async function getMessageContext(
	userId: number,
	messageId: number,
	page: number
) {
	try {
		const itemsPerPage = Number(process.env.ITEMS_PER_PAGE) || 10;

		// Get the row number of the message. This is used to determine what page the message is on
		// We are using row instead of id because id can have gaps in it
		const messageIndex = await db.query(
			`SELECT message_index, messages.user_id FROM (SELECT messages.id, messages.user_id, ROW_NUMBER() OVER (ORDER BY created_at ASC) AS message_index FROM messages) AS messages WHERE messages.id = $1`,
			[Number(messageId)]
		);
		if (messageIndex.rows.length === 0) {
			return {
				success: false as const,
				error: 'Message not found'
			};
		}
		if (messageIndex.rows[0]['user_id'] !== userId) {
			return {
				success: false as const,
				error: 'This message does not belong to specified user'
			};
		}
		const user = await db.query(`SELECT user_name FROM users WHERE id = $1`, [
			userId
		]);
		if (user.rows.length === 0) {
			// This should never trigger because of the "messageIndex.rows[0]['user_id'] !== userId" check above
			// But just in case
			return {
				success: false as const,
				error: 'User not found'
			};
		}
		// Once we have the row number we can determine what page it is on
		const messagePage = Math.ceil(
			messageIndex.rows[0]['message_index'] / itemsPerPage - 1
		);
		// Then we minus or plus the page number requested by the user to get the offset
		const offset =
			messagePage * itemsPerPage + (Number(page) - 1) * itemsPerPage;
		// Then we can get the messages for that page
		const messages = await db.query(
			`SELECT messages.id, message_text, created_at, colors.color_name, user_id FROM messages LEFT JOIN colors ON messages.color_id = colors.id ORDER BY created_at ASC LIMIT $2 OFFSET $1`,
			[offset, itemsPerPage]
		);
		return {
			success: true as const,
			messages: messages.rows as Message[],
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

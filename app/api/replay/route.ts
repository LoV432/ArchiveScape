import { db } from '@/lib/db';
import { NextRequest } from 'next/server';

export type Replay = {
	message_text: string;
	color_name: string;
	time: number;
};

type Message = {
	message_text: string;
	created_at: string;
	color_name: string;
};
export async function GET(request: NextRequest) {
	try {
		const time = request.nextUrl.searchParams.get('time');
		if (!time) {
			return new Response(null, { status: 400 });
		}
		const timeObj = new Date(time);
		const fifteenMintues = new Date(timeObj.getTime() + 15 * 60 * 1000);
		const messages = (
			await db.query(
				`SELECT message_text, created_at, color_name FROM messages LEFT JOIN colors ON messages.color_id = colors.id WHERE created_at > $1 AND created_at < $2 ORDER BY created_at ASC`,
				[timeObj.toISOString(), fifteenMintues.toISOString()]
			)
		).rows as Message[];
		let messagesList: Replay[] = [];
		messages.forEach((message, index) => {
			if (index === 0) {
				const tempMessage = {
					message_text: message.message_text,
					color_name: message.color_name,
					time: 0
				};
				messagesList.push(tempMessage);
				return;
			}
			const timeDiff =
				new Date(message.created_at).getTime() -
				new Date(messages[index - 1].created_at).getTime();
			const tempMessage = {
				message_text: message.message_text,
				color_name: message.color_name,
				time: timeDiff
			};
			messagesList.push(tempMessage);
		});
		return new Response(JSON.stringify(messagesList), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (e) {
		console.log(e);
		return new Response(null, { status: 500 });
	}
}

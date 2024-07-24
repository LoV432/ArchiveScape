export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';

export async function GET() {
	try {
		const res = await db.query(
			'SELECT id FROM messages ORDER BY id DESC LIMIT 1'
		);
		const lastMessageId = res.rows[0].id as number;
		return new Response(JSON.stringify({ id: lastMessageId }), { status: 200 });
	} catch (e) {
		console.log(e);
		return new Response(null, { status: 500 });
	}
}

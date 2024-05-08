export const dynamic = 'force-dynamic';
import { getRandomMessage } from '@/lib/random-message';

export async function GET() {
	try {
		const message = await getRandomMessage();
		return new Response(JSON.stringify(message), { status: 200 });
	} catch (e) {
		console.log(e);
		return new Response(null, { status: 500 });
	}
}

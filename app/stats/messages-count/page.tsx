import { getMessagesCount } from '@/lib/get-messages-count';
import MessagesCountChart from './page.client';
export const dynamic = 'force-dynamic';

export default async function Page() {
	const messagesCount = await getMessagesCount();
	return <MessagesCountChart chartData={messagesCount} />;
}

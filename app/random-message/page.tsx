import { Metadata } from 'next/types';
import RandomMessage from './page.client';
import { getRandomMessage } from '@/lib/random-message';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
	title: 'Random Message | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/'
};
export default async function Page() {
	const { message_text, color_name } = await getRandomMessage();
	const messageTime = message_text.length * 30 + 5000;
	return (
		<RandomMessage
			message_text={message_text}
			color_name={color_name}
			messageTime={messageTime}
		/>
	);
}

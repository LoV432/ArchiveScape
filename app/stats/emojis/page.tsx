import { emojiBarList } from '@/lib/emoji-cloud';
import EmojiBar from './page.client';
export const dynamic = 'force-dynamic';
import { Metadata } from 'next/types';

export const metadata: Metadata = {
	title: 'Most Used Emojis | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/'
};

export default async function Page() {
	const emojis = await emojiBarList();
	const labels = emojis.map((emoji) => emoji.emoji);
	const dataset = {
		label: 'Emoji Count',
		data: emojis.map((emoji) => emoji.count),
		backgroundColor: 'rgba(255, 99, 132, 0.5)'
	};
	return <EmojiBar labels={labels} dataset={dataset} />;
}

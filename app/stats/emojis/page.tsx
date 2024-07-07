import { emojiBarList } from '@/lib/emoji-cloud';
import EmojiBar from './page.client';
export const dynamic = 'force-dynamic';
import { Metadata } from 'next/types';

export const metadata: Metadata = {
	title: 'Most Used Emojis | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/'
};

export default async function Page() {
	const { chartData, chartConfig } = await emojiBarList();
	return <EmojiBar chartData={chartData} chartConfig={chartConfig} />;
}

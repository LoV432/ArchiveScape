import { emojiBarList } from '@/lib/emoji-cloud';
import EmojiBar from './page.client';
export const dynamic = 'force-dynamic';
import { Metadata } from 'next/types';
import { userAgentFromString } from 'next/server';
import { headers } from 'next/headers';
import { memCache, min } from '@/lib/memCache';

export const metadata: Metadata = {
	title: 'Most Used Emojis | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/'
};

async function emojiBarListWithCache() {
	return memCache.get('emoji-bar-list', min(5), emojiBarList);
}

export default async function Page() {
	const headersList = await headers();
	const { device } = userAgentFromString(
		headersList.get('user-agent') as string
	);
	const { chartData, chartConfig } = await emojiBarListWithCache();
	const deviceType = device.type === 'mobile' ? 'mobile' : 'desktop';
	if (deviceType === 'mobile') {
		const chartDataMobile = chartData.slice(13);
		let chartConfigMobile = chartConfig;
		Object.keys(chartConfig)
			.slice(13)
			.forEach((emoji) => {
				chartConfigMobile[emoji].label = emoji;
			});
		return (
			<EmojiBar chartData={chartDataMobile} chartConfig={chartConfigMobile} />
		);
	}
	return <EmojiBar chartData={chartData} chartConfig={chartConfig} />;
}

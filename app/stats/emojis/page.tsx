import { emojiBarList } from '@/lib/emoji-cloud';
import EmojiBar from './page.client';
export const dynamic = 'force-dynamic';
import { Metadata } from 'next/types';
import { userAgentFromString } from 'next/server';
import { headers } from 'next/headers';

export const metadata: Metadata = {
	title: 'Most Used Emojis | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/'
};

export default async function Page() {
	const headersList = headers();
	const { device } = userAgentFromString(
		headersList.get('user-agent') as string
	);
	const deviceType = device.type === 'mobile' ? 'mobile' : 'desktop';
	const { chartData, chartConfig } = await emojiBarList();
	if (deviceType === 'mobile') {
		const chartDataMobile = chartData.slice(0, 7);
		let chartConfigMobile = chartConfig;
		Object.keys(chartConfig)
			.slice(0, 7)
			.forEach((emoji) => {
				chartConfigMobile[emoji].label = emoji;
			});
		return (
			<EmojiBar chartData={chartDataMobile} chartConfig={chartConfigMobile} />
		);
	}
	return <EmojiBar chartData={chartData} chartConfig={chartConfig} />;
}

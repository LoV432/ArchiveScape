import { ChartConfig } from '@/components/ui/chart';
import { db } from '@/lib/db';

// TODO: Check if we can use React/Next.js built-in caching stuff?
let datasetCache: {
	chartConfig: ChartConfig;
	chartData: { [key: string]: any }[];
} = {
	chartConfig: {},
	chartData: []
};
let lastUpdated = 0;

export async function emojiBarList() {
	const now = Date.now();
	if (now - lastUpdated < 1000 * 60 * 5 && datasetCache.chartData.length > 0) {
		return datasetCache;
	}
	lastUpdated = now;

	const twentyDaysAgo = new Date();
	twentyDaysAgo.setUTCDate(twentyDaysAgo.getUTCDate() - 19);
	twentyDaysAgo.setUTCHours(0, 0, 0, 0);

	const allMessages = (
		await db.query(
			`SELECT message_text, created_at FROM messages WHERE created_at > $1 AND message_text ~ '[\u{1F600}-\u{1F64F}]' ORDER BY created_at DESC`,
			[twentyDaysAgo.toUTCString()]
		)
	).rows as { message_text: string; created_at: Date }[];

	let allEmojisCount: { [day: string]: { [emoji: string]: number } } = {};
	let mostUsedEmojis: { [emoji: string]: number } = {};
	allMessages.forEach((message) => {
		const date = message.created_at.toISOString().split('T')[0];
		if (!allEmojisCount[date]) {
			allEmojisCount[date] = {};
		}
		// @ts-ignore
		// Type error: This regular expression flag is only available when targeting 'es6' or later.
		// Setting target to es6 doesn't work, so we ignore the error.
		const emojis = message.message_text.match(/[\u{1F600}-\u{1F64F}]/gu) || [];
		emojis.forEach((emoji) => {
			// This counts each emoji used per day
			// { '2023-01-01': { '😀': 50, '😎': 20 } }
			// We use this to make the chart
			allEmojisCount[date][emoji] = (allEmojisCount[date][emoji] || 0) + 1;
			// This totals all emojis used
			// { '😀': 100, '😎': 20 }
			// We use this to figure out which emoji to show on the chart
			mostUsedEmojis[emoji] = (mostUsedEmojis[emoji] || 0) + 1;
		});
	});
	const mostUsedEmojisArray = Object.entries(mostUsedEmojis)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5)
		.map(([emoji]) => emoji);
	const chartData = Object.entries(allEmojisCount)
		.map(([date, emojis]) => {
			const topEmojis = Object.entries(emojis);
			let perDayData = {} as { [key: string]: number | string };
			// perDayData looks like this:
			// { 'date': '2023-01-01', '😀': 50, '😎': 20 }
			// TODO: Figure out how to make type safety work here
			perDayData['date'] = new Date(date).toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric'
			});
			topEmojis.forEach(({ [0]: emoji, [1]: count }) => {
				if (!mostUsedEmojisArray.includes(emoji)) return;
				perDayData[emoji] = count;
			});
			return { ...perDayData };
		})
		.reverse();
	let chartConfig: ChartConfig = {};
	mostUsedEmojisArray.forEach((emoji, index) => {
		chartConfig[emoji] = {
			label: emoji,
			color: `hsl(var(--chart-${index + 1}))`
		};
	});
	datasetCache = { chartConfig, chartData };
	return { chartConfig, chartData };
}

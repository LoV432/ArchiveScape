import { db } from '@/lib/db';

// TODO: Check if we can use React/Next.js built-in caching stuff?
let datasetCache: {
	labels: string[];
	dataset: { label: string; data: number[]; backgroundColor: string }[];
} = {
	labels: [],
	dataset: []
};
let lastUpdated = 0;

export async function emojiBarList() {
	const now = Date.now();
	if (now - lastUpdated < 1000 * 60 * 5 && datasetCache.labels.length > 0) {
		return datasetCache;
	}
	lastUpdated = now;

	const twentyDaysAgo = new Date();
	twentyDaysAgo.setUTCDate(twentyDaysAgo.getUTCDate() - 19);
	twentyDaysAgo.setUTCHours(0, 0, 0, 0);

	const allMessages = (
		await db.query(
			`SELECT message_text, created_at FROM messages WHERE created_at > $1 ORDER BY created_at DESC`,
			[twentyDaysAgo.toUTCString()]
		)
	).rows as { message_text: string; created_at: Date }[];

	let allEmojisCount: { [day: string]: { [emoji: string]: number } } = {};
	allMessages.forEach((message) => {
		const date = new Date(
			message.created_at.setUTCHours(0, 0, 0, 0)
		).toISOString();
		if (!allEmojisCount[date]) {
			allEmojisCount[date] = {};
		}
		const emojis = message.message_text.match(/[\u{1F600}-\u{1F64F}]/gu) || [];
		emojis.forEach((emoji) => {
			allEmojisCount[date][emoji] = (allEmojisCount[date][emoji] || 0) + 1;
		});
	});

	const allEmojisCountArray = Object.entries(allEmojisCount).map(
		([date, emojis]) => {
			const topEmojis = Object.entries(emojis)
				.sort((a, b) => b[1] - a[1])
				.slice(0, 10)
				.map(([emoji, count]) => ({ emoji, count }));
			return { date: new Date(date).toISOString(), emojis: topEmojis };
		}
	);

	const labels = allEmojisCountArray.map(({ date }) =>
		new Date(date).toLocaleDateString('en-US', {
			year: '2-digit',
			month: 'short',
			day: 'numeric'
		})
	);

	let allEmojis: string[] = [];
	allEmojisCountArray.forEach(({ emojis }) => {
		emojis.forEach(({ emoji }) => {
			if (!allEmojis.includes(emoji)) {
				allEmojis.push(emoji);
			}
		});
	});

	let dataset = allEmojis.map((emoji) => ({
		label: emoji,
		data: allEmojisCountArray.map(({ date, emojis }) => {
			const emojiData = emojis.find((e) => e.emoji === emoji);
			return emojiData ? emojiData.count : 0;
		}),
		backgroundColor: ''
	}));

	dataset.sort(
		(a, b) =>
			b.data.reduce((acc, curr) => acc + curr, 0) -
			a.data.reduce((acc, curr) => acc + curr, 0)
	);
	dataset = dataset.slice(0, 7);

	dataset.forEach((_, index) => {
		dataset[index].backgroundColor = rainbowColors[index];
	});
	datasetCache = { labels, dataset };
	return { labels, dataset };
}

const rainbowColors = [
	'#1a85a4',
	'#f5c667',
	'#6d4e7a',
	'#a2d76f',
	'#c74230',
	'#fc9d5b',
	'#92ded1'
];

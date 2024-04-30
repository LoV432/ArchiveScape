import { db } from '@/lib/db';
import { swearWords } from './swear-words';

type Message = {
	message_text: string;
};

// TODO: Check if we can use React/Next.js built-in caching stuff?
let swearCloudListCache: { x: string; y: number }[] = [];
let lastUpdated = 0;

export async function swearCloudList() {
	const now = Date.now();
	if (now - lastUpdated < 1000 * 60 * 5 && swearCloudListCache.length > 0) {
		return swearCloudListCache;
	}
	lastUpdated = now;

	let allSwearsList: string[] = [];
	let allSwearsCount: Record<string, number> = {};
	const threeDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 3);

	const allMessages = await db.query(
		`SELECT message_text FROM messages WHERE created_at > $1 ORDER BY created_at DESC`,
		[threeDaysAgo.toUTCString()]
	);
	allMessages.rows.forEach((message: Message) => {
		allSwearsList.push(...message.message_text.split(' '));
	});
	allSwearsList.forEach((word: string) => {
		if (!swearWords.includes(word)) return;
		// This basically checks for [word] in allSwearsCount Object and if it doesn't exist, it creates it with a value of 1
		// If it does exist, it increments the value by 1
		allSwearsCount[word] = (allSwearsCount[word] || 0) + 1;
	});
	const maxCount = Math.max(...Object.values(allSwearsCount));
	const normalizationFactor = 100 / maxCount; // Used to normalize the count to be between 0 and 100

	const allSwearsCountArray = Object.entries(allSwearsCount)
		.sort((a, b) => b[1] - a[1])
		.map(([word, count]) => ({
			x: word,
			y: count * normalizationFactor
		}));
	swearCloudListCache = allSwearsCountArray;
	return allSwearsCountArray;
}

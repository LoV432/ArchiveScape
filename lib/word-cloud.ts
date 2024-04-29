import { db } from '@/lib/db';
import { stopWords } from '@/lib/stop-words';

type Message = {
	message_text: string;
};

// TODO: Check if we can use React/Next.js built-in caching stuff?
let wordCloudListCache: { x: string; y: number }[] = [];
let lastUpdated = 0;

export async function wordCloudList() {
	const now = Date.now();
	if (now - lastUpdated < 1000 * 60 * 5 && wordCloudListCache.length > 0) {
		return wordCloudListCache;
	}
	lastUpdated = now;

	let allWordsList: string[] = [];
	let allWordsCount: Record<string, number> = {};
	const threeHoursAgo = new Date(Date.now() - 1000 * 60 * 60 * 3);

	const allMessages = await db.query(
		`SELECT message_text FROM messages WHERE created_at > $1 ORDER BY created_at DESC`,
		[threeHoursAgo.toUTCString()]
	);
	allMessages.rows.forEach((message: Message) => {
		allWordsList.push(...message.message_text.split(' '));
	});
	allWordsList.forEach((word: string) => {
		word = word.replace(/[.,!?:'";]+/g, '').toLowerCase(); // remove punctuation
		if (
			word.length < 3 || // remove words less than 3 characters TODO: Consider changing this.
			[...stopWords].includes(word.toLowerCase()) || // remove stop words
			word.startsWith('-') // remove messages starting with - because they are usually just name tags
		)
			return;
		// This basically checks for [word] in allWordsCount Object and if it doesn't exist, it creates it with a value of 1
		// If it does exist, it increments the value by 1
		allWordsCount[word] = (allWordsCount[word] || 0) + 1;
	});
	const maxCount = Math.max(...Object.values(allWordsCount));
	const normalizationFactor = 100 / maxCount; // Used to normalize the count to be between 0 and 100
	const allWordsCountArray = Object.entries(allWordsCount)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 200)
		.map(([word, count]) => ({
			x: word,
			y: Math.round(count * normalizationFactor)
		}));
	wordCloudListCache = allWordsCountArray;
	return allWordsCountArray;
}

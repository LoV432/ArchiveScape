import { db } from '@/lib/db';

type Message = {
	message_text: string;
};

// TODO: Check if we can use React/Next.js built-in caching stuff?
let emojiCloudListCache: { x: string; y: number }[] = [];
let lastUpdated = 0;

export async function emojiCloudList() {
	const now = Date.now();
	if (now - lastUpdated < 1000 * 60 * 5 && emojiCloudListCache.length > 0) {
		return emojiCloudListCache;
	}
	lastUpdated = now;

	let allEmojisList: string[] = [];
	let allEmojisCount: Record<string, number> = {};
	const threeHoursAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 6);

	const allMessages = await db.query(
		`SELECT message_text FROM messages WHERE created_at > $1 ORDER BY created_at DESC`,
		[threeHoursAgo.toUTCString()]
	);
	allMessages.rows.forEach((message: Message) => {
		allEmojisList.push(
			...(message.message_text.match(/\p{Emoji_Presentation}/gu) || [])
		);
	});
	allEmojisList.forEach((word: string) => {
		// This basically checks for [word] in allEmojisCount Object and if it doesn't exist, it creates it with a value of 1
		// If it does exist, it increments the value by 1
		allEmojisCount[word] = (allEmojisCount[word] || 0) + 1;
	});
	const maxCount = Math.max(...Object.values(allEmojisCount));
	const normalizationFactor = 100 / maxCount; // Used to normalize the count to be between 0 and 100
	const allEmojisCountArray = Object.entries(allEmojisCount)
		.sort((a, b) => b[1] - a[1])
		.map(([word, count]) => ({
			x: word,
			y: count * normalizationFactor
		}));
	emojiCloudListCache = allEmojisCountArray;
	return allEmojisCountArray;
}

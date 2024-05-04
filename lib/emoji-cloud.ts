import { db } from '@/lib/db';

type Message = {
	message_text: string;
};

// TODO: Check if we can use React/Next.js built-in caching stuff?
let emojiBarListCache: {
	emoji: string;
	count: number;
}[] = [];
let lastUpdated = 0;

export async function emojiBarList() {
	const now = Date.now();
	if (now - lastUpdated < 1000 * 60 * 5 && emojiBarListCache.length > 0) {
		return emojiBarListCache;
	}
	lastUpdated = now;

	let allEmojisList: string[] = [];
	let allEmojisCount: Record<string, number> = {};
	const twentyDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 20);

	const allMessages = await db.query(
		`SELECT message_text FROM messages WHERE created_at > $1 ORDER BY created_at DESC`,
		[twentyDaysAgo.toUTCString()]
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
	const allEmojisCountArray = Object.entries(allEmojisCount)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 10)
		.map(([emoji, count]) => ({
			emoji,
			count
		}));
	emojiBarListCache = allEmojisCountArray;
	return allEmojisCountArray;
}

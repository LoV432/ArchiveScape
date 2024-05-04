import { emojiBarList } from '@/lib/emoji-cloud';
import EmojiBar from './page.client';
import { Suspense } from 'react';
import LoadingOverlay from '@/components/LoadingOverlay';
export const dynamic = 'force-dynamic';

export default async function Page() {
	const emojis = await emojiBarList();
	const labels = emojis.map((emoji) => emoji.emoji);
	const dataset = {
		label: 'Emoji Count',
		data: emojis.map((emoji) => emoji.count),
		backgroundColor: 'rgba(255, 99, 132, 0.5)'
	};
	return (
		<div>
			<Suspense fallback={<LoadingOverlay />}>
				<EmojiBar labels={labels} dataset={dataset} />
			</Suspense>
		</div>
	);
}

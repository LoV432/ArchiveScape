import { Suspense } from 'react';
import Canvas from './Canvas';
import { emojiCloudList } from '@/lib/emoji-cloud';
import LoadingOverlay from '@/components/LoadingOverlay';
export const dynamic = 'force-dynamic';

export default async function Page() {
	const emojis = await emojiCloudList();
	return (
		<Suspense fallback={<LoadingOverlay />}>
			<Canvas emojis={emojis} />
		</Suspense>
	);
}

import { Suspense } from 'react';
import Canvas from './Canvas';
import { wordCloudList } from '@/lib/word-cloud';
import LoadingOverlay from '@/components/LoadingOverlay';
export const dynamic = 'force-dynamic';

export default async function Page() {
	const words = await wordCloudList();
	return (
		<Suspense fallback={<LoadingOverlay />}>
			<Canvas words={words} />
		</Suspense>
	);
}

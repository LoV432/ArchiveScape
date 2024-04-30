import { Suspense } from 'react';
import Canvas from './Canvas';
import { swearCloudList } from '@/lib/swears-cloud';
import LoadingOverlay from '@/components/LoadingOverlay';
export const dynamic = 'force-dynamic';

export default async function Page() {
	const swears = await swearCloudList();
	return (
		<Suspense fallback={<LoadingOverlay />}>
			<Canvas swears={swears} />
		</Suspense>
	);
}

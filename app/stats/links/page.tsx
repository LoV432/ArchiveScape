import LoadingOverlay from '@/components/LoadingOverlay';
import { Suspense } from 'react';
import AllMessagesWithLinks from './page.client';
import { getTopDomain } from '@/app/api/stats/links/route';

export default async function Page() {
	const topDomain = await getTopDomain();
	return (
		<main className="mx-auto flex flex-col gap-3 pt-5">
			<h1 className="text-center text-2xl text-rose-700 sm:text-5xl">
				Most Sent Domain:
			</h1>
			<Suspense fallback={<LoadingOverlay />}>
				<p className="pb-3 text-center text-2xl text-rose-700 sm:text-5xl">
					{topDomain.domain}
				</p>
			</Suspense>
			<AllMessagesWithLinks />
		</main>
	);
}

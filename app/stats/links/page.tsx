import AllMessagesWithLinks from './page.client';
import { getTopDomain } from '@/lib/top-domain';
export const dynamic = 'force-dynamic';

export default async function Page() {
	const topDomain = await getTopDomain();
	return (
		<main className="mx-auto flex flex-col gap-3 pt-5">
			<h1 className="text-center text-2xl text-rose-700 sm:text-5xl">
				Most Sent Domain:
			</h1>
			<p className="pb-3 text-center text-2xl text-rose-700 sm:text-5xl">
				{topDomain.domain}
			</p>
			<AllMessagesWithLinks />
		</main>
	);
}

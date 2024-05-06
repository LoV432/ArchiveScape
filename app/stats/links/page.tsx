import AllMessagesWithLinks from './page.client';
import TopDomain from './top-domain.server';
export const dynamic = 'force-dynamic';
import { Metadata } from 'next/types';

export const metadata: Metadata = {
	title: 'Links Sent By Users | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/'
};

export default async function Page() {
	return (
		<main className="mx-auto flex flex-col gap-3 pt-5">
			<h1 className="text-center text-2xl text-rose-700 sm:text-5xl">
				Most Sent Domain:
			</h1>
			<p className="pb-3 text-center text-2xl text-rose-700 sm:text-5xl">
				<TopDomain />
			</p>
			<AllMessagesWithLinks />
		</main>
	);
}

import { getAllLinks } from '@/lib/all-links';
const AllMessagesWithLinks = dynamic(() => import('./page.client'), {
	ssr: false,
	loading: () => <LoadingTable />
});
import TopDomain from './top-domain.server';
import dynamic from 'next/dynamic';
import { Metadata } from 'next/types';
import LoadingTable from '@/components/LoadingTable';

export const metadata: Metadata = {
	title: 'Links Sent By Users | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/'
};

export default async function Page({
	searchParams
}: {
	searchParams: { page: string };
}) {
	const page = Number(searchParams.page) || 1;
	const data = await getAllLinks(page);
	return (
		<main className="mx-auto flex flex-col gap-3 pt-5">
			<h1 className="text-center text-2xl text-rose-700 sm:text-5xl">
				Most Sent Domain:
			</h1>
			<p className="pb-3 text-center text-2xl text-rose-700 sm:text-5xl">
				<TopDomain />
			</p>
			<AllMessagesWithLinks data={data} page={page} />
		</main>
	);
}

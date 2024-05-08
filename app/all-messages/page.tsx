import { Metadata } from 'next/types';
import { Suspense } from 'react';
import { getAllMessages } from '@/lib/all-messages';
import dynamic from 'next/dynamic';
import LoadingTable from '@/components/LoadingTable';
const AllMessagesPage = dynamic(() => import('./page.client'), {
	ssr: false,
	loading: () => <LoadingTable />
});

export const metadata: Metadata = {
	title: 'All Messages | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/'
};

export default function Page({
	searchParams
}: {
	searchParams: { page: string };
}) {
	const page = Number(searchParams.page) || 1;
	return (
		<div className="grid">
			<AllMessages page={page} />
		</div>
	);
}

async function AllMessages({ page }: { page: number }) {
	const data = await getAllMessages(page);
	return (
		<>
			<h1 className="place-self-center py-5 text-center text-xl font-bold sm:text-5xl">
				<p className="pb-1">All Messages</p>
			</h1>
			<AllMessagesPage data={data} />
		</>
	);
}

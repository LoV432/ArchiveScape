import { Metadata } from 'next/types';
import { getAllMessages } from '@/lib/all-messages';
import LoadingTable from '@/components/LoadingTable';
import { Suspense, use } from 'react';
import AllMessages from './AllMessages';

export async function generateMetadata({
	searchParams
}: {
	searchParams: { page: string; user_id: number };
}) {
	let metaObject: Metadata = {
		title: 'All Messages | ArchiveScape',
		description:
			'An archive of all messages sent on https://www.ventscape.life/'
	};
	if (searchParams.page || searchParams.user_id) {
		metaObject.robots = {
			index: false,
			follow: false
		};
	}
	return metaObject;
}

export default async function Page({
	searchParams
}: {
	searchParams: { page: string; user_id: number };
}) {
	return (
		<div className="grid">
			<h1 className="place-self-center py-5 text-center text-xl font-bold sm:text-5xl">
				<p className="pb-1">All Messages</p>
			</h1>
			<Suspense fallback={<LoadingTable />}>
				<AllMessagesForSuspense
					key={`${searchParams.page}${searchParams.user_id}`}
					searchParams={searchParams}
				/>
			</Suspense>
		</div>
	);
}

function AllMessagesForSuspense({
	searchParams
}: {
	searchParams: { page: string; user_id: number };
}) {
	const page = Number(searchParams.page) || 1;
	const highlightedUser = Number(searchParams.user_id) || undefined;
	const data = use(getAllMessages(page));
	return (
		<AllMessages data={data} page={page} highlightedUser={highlightedUser} />
	);
}

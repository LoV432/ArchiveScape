import { Metadata } from 'next/types';
import { getAllMessages } from '@/lib/all-messages';
import dynamic from 'next/dynamic';
import LoadingTable from '@/components/LoadingTable';
const AllMessagesPage = dynamic(() => import('./page.client'), {
	ssr: false,
	loading: () => <LoadingTable />
});

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
	const page = Number(searchParams.page) || 1;
	const highlightedUser = Number(searchParams.user_id) || null;
	const data = await getAllMessages(page);
	return (
		<div className="grid">
			<h1 className="place-self-center py-5 text-center text-xl font-bold sm:text-5xl">
				<p className="pb-1">All Messages</p>
			</h1>
			<AllMessagesPage
				data={data}
				page={page}
				highlightedUser={highlightedUser}
			/>
		</div>
	);
}

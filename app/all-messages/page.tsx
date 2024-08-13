import { Metadata } from 'next/types';
import { getAllMessages } from '@/lib/all-messages';
import { use } from 'react';
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

export default function Page({
	searchParams
}: {
	searchParams: { page: string; user_id: number };
}) {
	const page = Number(searchParams.page) || 1;
	if (page > 500) {
		return (
			<div className="grid">
				<h1 className="place-self-center py-5 text-center text-xl font-bold sm:text-5xl">
					<p className="pb-1">All Messages</p>
				</h1>
				<p className="text-center">
					You cannot view more than 500 pages at a time.
				</p>
			</div>
		);
	}
	const highlightedUser = Number(searchParams.user_id) || undefined;
	const data = use(getAllMessages(page));
	return (
		<div className="grid">
			<h1 className="place-self-center py-5 text-center text-xl font-bold sm:text-5xl">
				<p className="pb-1">All Messages</p>
			</h1>
			<AllMessages data={data} page={page} highlightedUser={highlightedUser} />
		</div>
	);
}

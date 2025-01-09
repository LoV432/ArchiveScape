import { Metadata } from 'next/types';
import { getAllMessages } from '@/lib/all-messages';
import { use } from 'react';
import { MessageSection } from './AllMessages';
import { LoadingTable } from '@/components/LoadingTable';
import { MessagesPagination } from '@/components/Pagination';
import { Suspense } from 'react';
import { parseFilters } from '@/lib/parseFilters';

export async function generateMetadata(props: {
	searchParams: Promise<{ page: string; user_id: number }>;
}) {
	const searchParams = await props.searchParams;
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

export default function Page(props: {
	searchParams: Promise<{
		page: string;
		user_id: number;
		order: string;
		dateStart: string;
		dateEnd: string;
	}>;
}) {
	const searchParams = use(props.searchParams);
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
	const { dateStart, dateEnd, order } = parseFilters(searchParams);
	const highlightedUser = Number(searchParams.user_id) || undefined;
	const data = getAllMessages(page, order, dateStart, dateEnd);
	return (
		<div className="grid grid-rows-[min-content,min-content,1fr,min-content]">
			<h1 className="place-self-center py-5 text-center text-xl font-bold sm:text-5xl">
				<p className="pb-1">All Messages</p>
			</h1>
			<MessagesPagination totalPages={500} page={page} />
			{page === 500 && (
				<p className="px-2 pb-5 text-center text-rose-500">
					You can view {order === 'asc' ? 'newer' : 'older'} messages by using
					the filter options below.
				</p>
			)}
			<Suspense
				fallback={
					<LoadingTable ariaLabel="Messages" tableHeadValues={['Message']} />
				}
			>
				<MessageSection data={data} highlightedUser={highlightedUser} />
			</Suspense>
			<MessagesPagination totalPages={500} page={page} />
		</div>
	);
}

import { Metadata } from 'next/types';
import { getAllMessages } from '@/lib/all-messages';
import { use } from 'react';
import AllMessages from './AllMessages';
import { Filters } from './Filters.z';

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
	searchParams: {
		page: string;
		user_id: number;
		order: string;
		dateStart: string;
		dateEnd: string;
	};
}) {
	const parsedFilters = Filters.safeParse({
		page: searchParams.page,
		order: searchParams.order,
		dateStart: searchParams.dateStart,
		dateEnd: searchParams.dateEnd,
		highlightedUser: searchParams.user_id
	});
	if (!parsedFilters.success) {
		return <ErrorPage message="There was an error parsing the filters." />;
	}
	if (parsedFilters.data.page > 500) {
		return (
			<ErrorPage message="You cannot view more than 500 pages at a time." />
		);
	}
	const data = use(getAllMessages(parsedFilters.data));
	return (
		<div className="grid">
			<h1 className="place-self-center py-5 text-center text-xl font-bold sm:text-5xl">
				<p className="pb-1">All Messages</p>
			</h1>
			<AllMessages initialData={data} />
		</div>
	);
}

function ErrorPage({ message }: { message: string }) {
	return (
		<div className="grid">
			<h1 className="place-self-center py-5 text-center text-xl font-bold sm:text-5xl">
				<p className="pb-1">All Messages</p>
			</h1>
			<p className="text-center">{message}</p>
		</div>
	);
}

import { Metadata } from 'next/types';
import Main from './Main';
import { getSearch } from '@/lib/search';
import Error from '@/components/Error';
import { parseFilters } from '@/lib/parseFilters';

export async function generateMetadata(props: {
	searchParams: Promise<{ search: string; page: string }>;
}) {
	const searchParams = await props.searchParams;
	let metaObject: Metadata = {
		title: 'Search | ArchiveScape',
		description:
			'An archive of all messages sent on https://www.ventscape.life/'
	};
	if (searchParams.search || searchParams.page) {
		metaObject.robots = {
			index: false,
			follow: false
		};
	}
	return metaObject;
}

export default async function Page(props: {
	searchParams: Promise<{
		search: string;
		page: string;
		dateStart?: string;
		dateEnd?: string;
		order?: string;
	}>;
}) {
	const searchParams = await props.searchParams;
	const searchQuery = searchParams.search || '';
	const page = Number(searchParams.page) || 1;
	const { dateStart, dateEnd, order } = parseFilters(searchParams);
	const data = await getSearch(searchQuery, page, dateStart, dateEnd, order);
	if (!data.success) {
		return <Error error={data.error} />;
	}
	return (
		<div className="grid">
			<Main searchQuery={searchQuery} page={page} data={data} />
		</div>
	);
}

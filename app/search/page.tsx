import { Metadata } from 'next/types';
import SearchPage from './page.client';
import { getSearch } from '@/lib/search';

export async function generateMetadata({
	searchParams
}: {
	searchParams: { search: string; page: string };
}) {
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

export default async function Page({
	searchParams
}: {
	searchParams: { search: string; page: string };
}) {
	const searchQuery = searchParams.search || '';
	const page = Number(searchParams.page) || 1;
	const data = await getSearch(searchQuery, page);
	return (
		<div className="grid">
			<SearchPage data={data} searchQuery={searchQuery} page={page} />
		</div>
	);
}

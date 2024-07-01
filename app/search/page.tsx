import { Metadata } from 'next/types';
import Main from './Main';
import { getSearch } from '@/lib/search';
import Error from '@/components/Error';

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
	searchParams: {
		search: string;
		page: string;
		dateStart?: string;
		dateEnd?: string;
	};
}) {
	const searchQuery = searchParams.search || '';
	const page = Number(searchParams.page) || 1;
	let dateStart = searchParams.dateStart || '';
	let dateEnd = searchParams.dateEnd || '';
	let parsedDateStart: Date | undefined = new Date(dateStart);
	let parsedDateEnd: Date | undefined = new Date(dateEnd);
	if (Number.isNaN(Number(parsedDateStart))) {
		parsedDateStart = undefined;
	}
	if (Number.isNaN(Number(parsedDateEnd))) {
		parsedDateEnd = undefined;
	}
	const data = await getSearch(
		searchQuery,
		page,
		parsedDateStart,
		parsedDateEnd
	);
	if (!data.success) {
		return <Error error={data.error} />;
	}
	return (
		<div className="grid">
			<Main
				data={data}
				searchQuery={searchQuery}
				page={page}
				preSelectedDateStart={parsedDateStart}
				preSelectedDateEnd={parsedDateEnd}
			/>
		</div>
	);
}

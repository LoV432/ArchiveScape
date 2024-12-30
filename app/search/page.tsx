import { Metadata } from 'next/types';
import { getSearch, getSearchResponse } from '@/lib/search';
import Error from '@/components/Error';
import { parseFilters } from '@/lib/parseFilters';
import { MessagesPagination } from '@/components/Pagination';
import MessagesSection from './MessagesSection';
import SearchBar from './SearchBar.client';
import Image from 'next/image';
import { Suspense, use } from 'react';
import { Button } from '@/components/ui/button';

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
	const data = getSearch(searchQuery, page, dateStart, dateEnd, order);

	return (
		<Suspense fallback={<LoadingSkeleton />}>
			<Main searchQuery={searchQuery} page={page} dataPromise={data} />
		</Suspense>
	);
}

function Main({
	dataPromise,
	searchQuery,
	page
}: {
	dataPromise: getSearchResponse;
	page: number;
	searchQuery: string;
}) {
	const data = use(dataPromise);
	if (!data.success) {
		return <Error error={data.error} />;
	}
	return (
		<div className="grid">
			<SearchBar searchQuery={searchQuery} />
			{data.messages.length === 0 && (
				<div className="flex flex-col place-items-center gap-4">
					{searchQuery !== '' && (
						<>
							<p className="text-xl font-semibold">No results :(</p>
							<Image
								loading="eager"
								src="/scribble.gif"
								alt="no search results"
								unoptimized
								width={200}
								height={200}
							/>
						</>
					)}
					{searchQuery === '' &&
						(Math.random() * 100 > 5 ? (
							<Image
								loading="eager"
								src="/cat.gif"
								alt="cat waiting patiently"
								unoptimized
								width={400}
								height={400}
							/>
						) : (
							<Image
								loading="eager"
								src="/duck.gif"
								alt="duck being a duck"
								unoptimized
								width={150}
								height={150}
							/>
						))}
				</div>
			)}
			{data.messages.length > 0 && (
				<>
					{data.totalPages > 1 && (
						<MessagesPagination page={page} totalPages={data.totalPages} />
					)}
					<MessagesSection messages={data.messages} />
					{data.totalPages > 1 && (
						<MessagesPagination page={page} totalPages={data.totalPages} />
					)}
				</>
			)}
		</div>
	);
}

function LoadingSkeleton() {
	return (
		<div className="grid">
			<div className="relative mx-auto my-10 flex h-14 w-full max-w-[800px] px-4 sm:w-2/3 sm:px-0">
				<input
					type="text"
					placeholder="Loading..."
					disabled
					className="peer order-2 h-full w-full border border-x-0 border-gray-300 border-opacity-35 bg-[rgb(18,18,18)] text-center text-2xl font-bold focus-visible:border-opacity-70 focus-visible:outline-none"
				/>
				<div className="order-l h-full rounded-l border border-r-0 border-gray-300 border-opacity-35 bg-[rgb(18,18,18)] p-2 peer-focus-visible:border-opacity-70 peer-focus-visible:outline-none">
					<div
						className={`grid h-full w-[45px] cursor-pointer place-items-center rounded text-muted-foreground hover:bg-accent active:bg-accent`}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="ionicon h-full w-6"
							viewBox="0 0 512 512"
						>
							<path
								fill="none"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="32"
								d="M32 144h448M112 256h288M208 368h96"
							/>
						</svg>
					</div>
				</div>
				<div className="order-3 h-full rounded-r border border-l-0 border-gray-300 border-opacity-35 bg-[rgb(18,18,18)] p-2 peer-focus-visible:border-opacity-70 peer-focus-visible:outline-none">
					<Button className="h-full w-full rounded bg-transparent px-3 text-3xl text-white hover:bg-zinc-800">
						⏎
					</Button>
				</div>
			</div>
			<div className="flex flex-col place-items-center gap-4">
				<Image
					loading="eager"
					src="/cat.gif"
					alt="cat waiting patiently"
					unoptimized
					width={400}
					height={400}
				/>
			</div>
		</div>
	);
}

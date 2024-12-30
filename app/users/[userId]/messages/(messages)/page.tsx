import { redirect } from 'next/navigation';
import { Metadata } from 'next/types';
import Error from '@/components/Error';
import { MessagesTable } from './MessagesPage';
import { getUserMessages } from '@/lib/user-messages';
import Link from 'next/link';
import { MessagesPagination } from '@/components/Pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { LoadingTable } from '@/components/LoadingTable';
import { getUserMessagesResponse } from '@/lib/user-messages';
import { Suspense, use } from 'react';
import { LoadingPagination } from '@/components/LoadingPagination';
import { parseFilters } from '@/lib/parseFilters';

export const metadata: Metadata = {
	title: 'Messages By User | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/',
	robots: {
		index: false,
		follow: false
	}
};

export default async function UserMessagesPage(props: {
	params: Promise<{ userId: string }>;
	searchParams: Promise<{
		page: string;
		order: string;
		dateStart: string;
		dateEnd: string;
	}>;
}) {
	const searchParams = await props.searchParams;
	const params = await props.params;
	const { userId } = params;
	if (!userId || userId === '' || isNaN(Number(userId))) {
		redirect('/');
	}
	const page = Number(searchParams.page) || 1;
	const { dateStart, dateEnd, order } = parseFilters(searchParams);
	const data = getUserMessages(Number(userId), page, order, dateStart, dateEnd);
	return (
		<Suspense fallback={<LoadingSkeleton page={page} />}>
			<Main dataPromise={data} userId={Number(userId)} page={page} />
		</Suspense>
	);
}

function Main({
	dataPromise,
	userId,
	page
}: {
	dataPromise: getUserMessagesResponse;
	userId: number;
	page: number;
}) {
	const data = use(dataPromise);
	if (!data.success) {
		return <Error error={data.error} />;
	}
	return (
		<div className="grid">
			<h1 className="place-self-center py-5 text-center text-xl font-bold sm:text-5xl">
				<p className="pb-1">All Messages From</p>{' '}
				<Link
					href={`/users/${userId}`}
					className="underline underline-offset-8"
				>
					{data.user_name}
				</Link>
			</h1>
			<MessagesPagination page={page} totalPages={data.totalPages} />
			<MessagesTable messages={data.messages} userId={Number(userId)} />
			<MessagesPagination page={page} totalPages={data.totalPages} />
		</div>
	);
}

function LoadingSkeleton({ page }: { page: number }) {
	return (
		<div className="grid grid-rows-[min-content,min-content,1fr,min-content]">
			<h1 className="place-self-center py-5 text-center text-xl font-bold sm:text-5xl">
				<p className="pb-1">All Message From</p>
				<div className="relative mt-1 h-6 w-80 sm:mt-3 sm:h-12 sm:w-[700px]">
					<Skeleton
						className={`absolute left-0 top-0 h-full w-full rounded-full`}
					/>
				</div>
			</h1>
			<LoadingPagination page={page} />
			<LoadingTable ariaLabel="Messages" tableHeadValues={['Message']} />
			<LoadingPagination page={page} />
		</div>
	);
}

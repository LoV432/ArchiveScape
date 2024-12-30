import { redirect } from 'next/navigation';
import { Metadata } from 'next/types';
import Error from '@/components/Error';
import { MessageSection } from './MessageContext';
import {
	getMessageContext,
	getMessageContextResponse
} from '@/lib/message-context';
import Link from 'next/link';
import { MessagesPagination } from '@/components/Pagination';
import ScrollIntoView from './ScrollIntoView.client';
import { Skeleton } from '@/components/ui/skeleton';
import { LoadingPagination } from '@/components/LoadingPagination';
import { LoadingTable } from '@/components/LoadingTable';
import { Suspense, use } from 'react';

export const metadata: Metadata = {
	title: 'Message Context | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/',
	robots: {
		index: false,
		follow: false
	}
};

export default async function Page(props: {
	params: Promise<{ userId: string; messageId: string }>;
	searchParams: Promise<{ page: string }>;
}) {
	const searchParams = await props.searchParams;
	const params = await props.params;
	const { userId, messageId } = params;
	if (!messageId || messageId === '' || isNaN(Number(messageId))) {
		redirect('/');
	}
	if (!userId || userId === '' || isNaN(Number(userId))) {
		redirect('/');
	}
	let page = Number(searchParams.page);
	if (isNaN(page)) {
		page = 0;
	}
	const data = getMessageContext(Number(userId), Number(messageId), page);
	return (
		<Suspense fallback={<LoadingSkeleton page={page} />}>
			<Main
				userId={userId}
				messageId={messageId}
				page={page}
				dataPromise={data}
			/>
		</Suspense>
	);
}

function Main({
	userId,
	messageId,
	page,
	dataPromise
}: {
	userId: string;
	messageId: string;
	page: number;
	dataPromise: getMessageContextResponse;
}) {
	const data = use(dataPromise);
	if (!data.success) {
		return <Error error={data.error} />;
	}
	return (
		<div className="grid">
			<h1 className="place-self-center py-5 text-center text-xl font-bold sm:text-5xl">
				<p className="pb-2">Highlighted User</p>
				<Link
					href={`/users/${userId}`}
					className="underline underline-offset-8"
				>
					{data.user_name}
				</Link>
			</h1>
			<MessagesPagination
				totalPages={'infinite'}
				initalOrder="asc"
				page={page}
			/>
			<MessageSection messages={data.messages} userId={Number(userId)} />
			<MessagesPagination
				totalPages={'infinite'}
				initalOrder="asc"
				page={page}
			/>
			<ScrollIntoView messageId={Number(messageId)} />
		</div>
	);
}

function LoadingSkeleton({ page }: { page: number }) {
	return (
		<div className="grid grid-rows-[min-content,min-content]">
			<h1 className="place-self-center py-5 text-center text-xl font-bold sm:text-5xl">
				<p className="pb-1">Highlighted User</p>
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

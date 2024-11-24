import { redirect } from 'next/navigation';
import { Metadata } from 'next/types';
import Error from '@/components/Error';
import { MessagesTable } from './MessagesPage';
import { getUserMessages } from '@/lib/user-messages';
import Link from 'next/link';
import { MessagesPagination } from '@/components/Pagination';

export const metadata: Metadata = {
	title: 'Messages By User | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/',
	robots: {
		index: false,
		follow: false
	}
};

export default async function Main(props: {
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
	const order = searchParams.order === 'asc' ? 'asc' : 'desc';
	const dateStart = searchParams.dateStart
		? new Date(searchParams.dateStart)
		: undefined;
	const dateEnd = searchParams.dateEnd
		? new Date(searchParams.dateEnd)
		: undefined;
	const data = await getUserMessages(
		Number(userId),
		page,
		order,
		dateStart,
		dateEnd
	);
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

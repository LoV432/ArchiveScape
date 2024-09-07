import { redirect } from 'next/navigation';
import { Metadata } from 'next/types';
import Error from '@/components/Error';
import MessagesPage from './MessagesPage';
import { getUserMessages } from '@/lib/user-messages';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'Messages By User | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/',
	robots: {
		index: false,
		follow: false
	}
};

export default async function Main({
	params,
	searchParams
}: {
	params: { userId: string };
	searchParams: { page: string };
}) {
	const { userId } = params;
	if (!userId || userId === '' || isNaN(Number(userId))) {
		redirect('/');
	}
	const page = Number(searchParams.page) || 1;
	const data = await getUserMessages(Number(userId), page);
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
			<MessagesPage data={data} userId={Number(userId)} page={page} />
		</div>
	);
}

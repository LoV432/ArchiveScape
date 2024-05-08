import { redirect } from 'next/navigation';
import { Metadata } from 'next/types';
import dynamic from 'next/dynamic';
const MessagesPage = dynamic(() => import('./page.client'), {
	ssr: false,
	loading: () => <LoadingTable />
});
import { getUserMessages } from '@/lib/user-messages';
import LoadingTable from '@/components/LoadingTable';

export const metadata: Metadata = {
	title: 'Messages By User | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/'
};

export default function Main({
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
	return (
		<div className="grid">
			<MessagesByUser userId={userId} page={page} />
		</div>
	);
}

async function MessagesByUser({
	userId,
	page
}: {
	userId: string;
	page: number;
}) {
	const data = await getUserMessages(Number(userId), page);
	return (
		<>
			<h1 className="place-self-center py-5 text-center text-xl font-bold sm:text-5xl">
				<p className="pb-1">All Messages From</p> <p>{data.user_name}</p>
			</h1>
			<MessagesPage data={data} userId={Number(userId)} page={page} />
		</>
	);
}

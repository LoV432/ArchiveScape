import { redirect } from 'next/navigation';
import { Metadata } from 'next/types';
const Main = dynamic(() => import('./page.client'), {
	ssr: false,
	loading: () => <LoadingTable />
});
import { Suspense } from 'react';
import { getMessageContext } from '@/lib/message-context';
import dynamic from 'next/dynamic';
import LoadingTable from '@/components/LoadingTable';

export const metadata: Metadata = {
	title: 'Message Context | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/'
};

export default function Page({
	params,
	searchParams
}: {
	params: { userId: string; messageId: string };
	searchParams: { page: string };
}) {
	const { userId, messageId } = params;
	if (!messageId || messageId === '' || isNaN(Number(messageId))) {
		redirect('/');
	}
	if (!userId || userId === '' || isNaN(Number(userId))) {
		redirect('/');
	}
	let page = Number(searchParams.page);
	if (isNaN(page)) {
		page = 1;
	}
	return (
		<div className="grid">
			<ContextPage
				userId={Number(userId)}
				messageId={Number(messageId)}
				page={page}
			/>
		</div>
	);
}

async function ContextPage({
	userId,
	messageId,
	page
}: {
	userId: number;
	messageId: number;
	page: number;
}) {
	const data = await getMessageContext(userId, messageId, page);
	return <Main data={data} userId={userId} messageId={messageId} page={page} />;
}

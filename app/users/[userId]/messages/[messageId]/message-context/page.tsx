import { redirect } from 'next/navigation';
import { Metadata } from 'next/types';
import Error from '@/components/Error';
import MessageContext from './MessageContext';
import { getMessageContext } from '@/lib/message-context';

export const metadata: Metadata = {
	title: 'Message Context | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/',
	robots: {
		index: false,
		follow: false
	}
};

export default async function Page({
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
		page = 0;
	}
	const data = await getMessageContext(Number(userId), Number(messageId), page);
	if (!data.success) {
		return <Error error={data.error} />;
	}
	return (
		<div className="grid">
			<h1 className="place-self-center py-5 text-center text-xl font-bold sm:text-5xl">
				<p className="pb-2">Highlighted User</p>
				<p>{data.user_name}</p>
			</h1>
			<MessageContext
				data={data}
				userId={Number(userId)}
				messageId={Number(messageId)}
				page={page}
			/>
		</div>
	);
}

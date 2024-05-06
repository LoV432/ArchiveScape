import { redirect } from 'next/navigation';
import { Metadata } from 'next/types';
import Main from './page.client';

export const metadata: Metadata = {
	title: 'Message Context | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/'
};

export default function Page({
	params
}: {
	params: { userId: string; messageId: string };
}) {
	const { userId, messageId } = params;
	if (!messageId || messageId === '' || isNaN(Number(messageId))) {
		redirect('/');
	}
	if (!userId || userId === '' || isNaN(Number(userId))) {
		redirect('/');
	}
	return (
		<main className="grid">
			<Main userId={userId} messageId={messageId} />
		</main>
	);
}

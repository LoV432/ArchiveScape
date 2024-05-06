import { redirect } from 'next/navigation';
import { Suspense } from 'react';
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
			<Suspense>
				<Main userId={userId} messageId={messageId} />
			</Suspense>
		</main>
	);
}

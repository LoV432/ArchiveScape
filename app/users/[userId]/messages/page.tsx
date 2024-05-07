import { redirect } from 'next/navigation';
import { Metadata } from 'next/types';
import MessagesPage from './page.client';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Messages By User | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/'
};

export default function Main({ params }: { params: { userId: string } }) {
	const { userId } = params;
	if (!userId || userId === '' || isNaN(Number(userId))) {
		redirect('/');
	}
	return (
		<Suspense>
			<MessagesPage userId={userId} />
		</Suspense>
	);
}

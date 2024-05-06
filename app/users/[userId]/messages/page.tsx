import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Metadata } from 'next/types';
import MessagesPage from './page.client';

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
		<main className="grid">
			<Suspense>
				<MessagesPage userId={userId} />
			</Suspense>
		</main>
	);
}

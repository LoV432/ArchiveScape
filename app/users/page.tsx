import { Metadata } from 'next/types';
import { Suspense } from 'react';
import UsersPage from './page.client';

export const metadata: Metadata = {
	title: 'All Users | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/'
};

export default function Page() {
	return (
		<main className="grid">
			<Suspense>
				<UsersPage />
			</Suspense>
		</main>
	);
}
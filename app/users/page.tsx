import { Metadata } from 'next/types';
import UsersPage from './page.client';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'All Users | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/'
};

export default function Page() {
	return (
		<Suspense>
			<UsersPage />
		</Suspense>
	);
}

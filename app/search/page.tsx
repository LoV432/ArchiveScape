import { Metadata } from 'next/types';
import SearchPage from './page.client';

export const metadata: Metadata = {
	title: 'Search | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/'
};

export default function Page() {
	return (
		<main className="grid">
			<SearchPage />
		</main>
	);
}

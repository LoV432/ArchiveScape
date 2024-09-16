import { Metadata } from 'next/types';
import { TrendsChart } from './TrendsChart';

export const metadata: Metadata = {
	title: 'Word Trends | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/'
};

export default function Page() {
	return <TrendsChart />;
}

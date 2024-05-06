import { Metadata } from 'next/types';
import RandomMessage from './page.client';

export const metadata: Metadata = {
	title: 'Random Message | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/'
};

type RandomMessage = {
	message: string;
	color: string;
};

export default function Page() {
	return <RandomMessage />;
}

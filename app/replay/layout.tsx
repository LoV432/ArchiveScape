import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Replay | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/'
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return children;
}

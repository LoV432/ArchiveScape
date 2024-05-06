import LoadingOverlay from '@/components/LoadingOverlay';
import { Metadata } from 'next/types';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Most Used Emojis | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/'
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <Suspense fallback={<LoadingOverlay />}>{children}</Suspense>;
}

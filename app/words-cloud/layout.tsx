import LoadingOverlay from '@/components/LoadingOverlay';
import { Suspense } from 'react';

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <Suspense fallback={<LoadingOverlay />}>{children}</Suspense>;
}

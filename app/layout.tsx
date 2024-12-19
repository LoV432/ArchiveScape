import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import BreadcrumbComponent from '@/components/BreadCrumb';
import Script from 'next/script';
import SpinnerProvider from '@/components/spinner-provider';
import OutdatedIndicator from '@/components/OutdatedIndicator';
import { Toaster } from '@/components/ui/sonner';
import GlobalConsoleLog from '@/components/GlobalConsoleLog';
import ConfirmationProvider from '@/components/ConfirmationProvider';

export const metadata: Metadata = {
	title: 'Home | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/'
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
			<Script
				src="https://analytics-public.monib.xyz/js/script.js"
				data-domain="archivescape.monib.xyz"
				defer
			></Script>
			<body className="relative grid min-h-svh grid-rows-[auto_auto_1fr] font-mono sm:min-h-screen">
				<SpinnerProvider>
					<ConfirmationProvider>
						<Header />
						<BreadcrumbComponent />
						{children}
					</ConfirmationProvider>
					<OutdatedIndicator />
					<Toaster closeButton={true} />
					<GlobalConsoleLog />
				</SpinnerProvider>
			</body>
		</html>
	);
}

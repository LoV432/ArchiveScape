import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '@/components/query-provider';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/Header';
import BreadcrumbComponent from '@/components/BreadCrumb';
import Script from 'next/script';
import SpinnerProvider from '@/components/spinner-provider';

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
		// The theme provider recommends using suppressHydrationWarning
		// https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
		<html suppressHydrationWarning lang="en">
			<link rel="preload" href="/scribble.gif" as="image" />
			<link rel="preload" href="/cat.gif" as="image" />
			<Script
				src="https://analytics-public.monib.xyz/js/script.js"
				data-domain="archivescape.monib.xyz"
				defer
			></Script>
			<body className="relative grid min-h-svh grid-rows-[auto_auto_1fr] font-mono sm:min-h-screen">
				<QueryProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="dark"
						disableTransitionOnChange
					>
						<SpinnerProvider>
							<Header />
							<BreadcrumbComponent />
							{children}
						</SpinnerProvider>
					</ThemeProvider>
				</QueryProvider>
			</body>
		</html>
	);
}

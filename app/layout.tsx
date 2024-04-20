import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '@/components/query-provider';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app'
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
			<body className="relative">
				<QueryProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="dark"
						enableSystem
						disableTransitionOnChange
					>
						{children}
					</ThemeProvider>
				</QueryProvider>
			</body>
		</html>
	);
}

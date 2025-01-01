import { Toaster } from '@/components/ui/sonner';
import ConfirmationProvider from './ConfirmationProvider';
import OutdatedIndicator from './OutdatedIndicator';
import GlobalConsoleLog from './GlobalConsoleLog';
import NextTopLoader from 'nextjs-toploader';

export async function Providers({ children }: { children: React.ReactNode }) {
	return (
		<>
			<NextTopLoader
				color="white"
				height={4}
				showSpinner={false}
				shadow={false}
			/>
			<ConfirmationProvider>{children}</ConfirmationProvider>
			<OutdatedIndicator />
			<Toaster closeButton={true} />
			<GlobalConsoleLog />
		</>
	);
}

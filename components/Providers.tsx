import { Toaster } from '@/components/ui/sonner';
import ConfirmationProvider from './ConfirmationProvider';
import OutdatedIndicator from './OutdatedIndicator';
import GlobalConsoleLog from './GlobalConsoleLog';
import SpinnerProvider from './spinner-provider';

export async function Providers({ children }: { children: React.ReactNode }) {
	return (
		<>
			<SpinnerProvider />
			<ConfirmationProvider>{children}</ConfirmationProvider>
			<OutdatedIndicator />
			<Toaster closeButton={true} />
			<GlobalConsoleLog />
		</>
	);
}

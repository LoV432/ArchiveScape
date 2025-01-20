'use client';
import { Next13ProgressBar } from 'next13-progressbar';

export default function SpinnerProvider() {
	return (
		<Next13ProgressBar
			height="4px"
			color="#ffffff"
			options={{ showSpinner: false }}
		/>
	);
}

import { Metadata } from 'next/types';
import { Suspense } from 'react';
import { getAllMessages } from '@/lib/all-messages';
import LoadingOverlay from '@/components/LoadingOverlay';
import dynamic from 'next/dynamic';
const AllMessagesPage = dynamic(() => import('./page.client'), {
	ssr: false
});

export const metadata: Metadata = {
	title: 'All Messages | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/'
};

export default function Page({
	searchParams
}: {
	searchParams: { page: string };
}) {
	const page = Number(searchParams.page) || 1;
	return (
		<Suspense key={page} fallback={<LoadingOverlay />}>
			<AllMessages page={page} />
		</Suspense>
	);
}

async function AllMessages({ page }: { page: number }) {
	const data = await getAllMessages(page);
	return <AllMessagesPage data={data} />;
}

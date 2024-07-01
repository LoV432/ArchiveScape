import AllMessagesWithLinks from './Links';
import TopDomain from './top-domain.server';
import { Metadata } from 'next/types';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export async function generateMetadata({
	searchParams
}: {
	searchParams: { page: string };
}) {
	let metaObject: Metadata = {
		title: 'Links Sent By Users | ArchiveScape',
		description:
			'An archive of all messages sent on https://www.ventscape.life/'
	};
	if (searchParams.page) {
		metaObject.robots = {
			index: false,
			follow: false
		};
	}
	return metaObject;
}

export default async function Page({
	searchParams
}: {
	searchParams: { page: string };
}) {
	const page = Number(searchParams.page) || 1;
	return (
		<main className="mx-auto flex flex-col gap-3 pt-5">
			<h1 className="text-center text-2xl text-rose-700 sm:text-5xl">
				Most Sent Domain:
			</h1>
			<Suspense
				fallback={<Skeleton className="h-11 w-[80vw] sm:h-14 sm:w-[600px]" />}
			>
				<p className="pb-3 text-center text-2xl text-rose-700 sm:text-5xl">
					<TopDomain />
				</p>
			</Suspense>
			<Suspense
				fallback={
					<div className="border-t text-center text-2xl sm:text-5xl">
						Loading Messages...
					</div>
				}
			>
				<AllMessagesWithLinks page={page} />
			</Suspense>
		</main>
	);
}

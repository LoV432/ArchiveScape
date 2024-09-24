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
			<h1 className="text-center text-2xl font-bold text-rose-700 sm:text-5xl">
				Top Domain:
			</h1>
			<Suspense
				fallback={<Skeleton className="h-11 w-[80vw] sm:h-14 sm:w-[600px]" />}
			>
				<p className="pb-3 text-center text-2xl font-bold text-rose-700 sm:text-5xl">
					<TopDomain />
				</p>
			</Suspense>
			<Suspense
				fallback={
					<div className="mx-auto mt-28 grid place-items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="38"
							height="38"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="animate-spin"
						>
							<path d="M21 12a9 9 0 1 1-6.219-8.56" />
						</svg>
					</div>
				}
			>
				<AllMessagesWithLinks page={page} />
			</Suspense>
		</main>
	);
}

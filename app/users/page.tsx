import { Metadata } from 'next/types';
import UsersPage from './page.client';
import { Suspense } from 'react';
import { getAllUsers } from '@/lib/all-users';

export const metadata: Metadata = {
	title: 'All Users | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/'
};

export default function Page({
	searchParams
}: {
	searchParams: { page: string };
}) {
	const page = Number(searchParams.page) || 1;
	return (
		<div className="grid">
			<AllUsers page={page} />
		</div>
	);
}

async function AllUsers({ page }: { page: number }) {
	const data = await getAllUsers(page);
	return (
		<>
			<h1 className="place-self-center py-5 text-center text-xl font-bold sm:text-5xl">
				<p className="pb-2">All Users</p>
			</h1>
			<UsersPage data={data} />
		</>
	);
}

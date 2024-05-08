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
	return <UsersPage data={data} />;
}

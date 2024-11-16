import { Metadata } from 'next/types';
import UsersPage from './AllUsers';
import { getAllUsers } from '@/lib/all-users';
import { use } from 'react';

export async function generateMetadata(props: {
	searchParams: Promise<{ page: string }>;
}) {
	const searchParams = await props.searchParams;
	let metaObject: Metadata = {
		title: 'Users | ArchiveScape',
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

export default function Page(props: {
	searchParams: Promise<{ page: string }>;
}) {
	const searchParams = use(props.searchParams);
	const page = Number(searchParams.page) || 1;
	const data = use(getAllUsers(page));
	return (
		<div className="grid">
			<h1 className="place-self-center py-5 text-center text-xl font-bold sm:text-5xl">
				<p className="pb-2">All Users</p>
			</h1>
			<UsersPage data={data} page={page} />
		</div>
	);
}

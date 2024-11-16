import getConversations from './getConversations';
import AllConversationMessagesPage from './AllConversationMessages';
import UserBadge from './UserBadge';
import { cookies } from 'next/headers';
import AddUsers from './AddUsers';
import { Metadata } from 'next';

export async function generateMetadata(props: {
	searchParams: Promise<{ page: string; user_id: number }>;
}) {
	const searchParams = await props.searchParams;
	let metaObject: Metadata = {
		title: 'Conversation Tracker | ArchiveScape',
		description:
			'An archive of all messages sent on https://www.ventscape.life/'
	};
	if (searchParams.page || searchParams.user_id) {
		metaObject.robots = {
			index: false,
			follow: false
		};
	}
	return metaObject;
}

export default async function Page(props: {
	searchParams: Promise<{ page: string }>;
}) {
	const searchParams = await props.searchParams;
	const page = Number(searchParams.page) || 1;
	const conversationTrackerCookie = (await cookies()).get(
		'conversationTracker'
	)?.value;
	if (!conversationTrackerCookie) {
		return (
			<div className="flex flex-col gap-5">
				<h1 className="place-self-center py-5 text-center text-xl font-bold sm:text-5xl">
					<p className="pb-1">Conversation Tracker</p>
				</h1>
				<p className="text-center">You have no users selected to track.</p>
				<AddUsers type="button" />
			</div>
		);
	}
	const coversationTrackerUsers = conversationTrackerCookie
		.split(',')
		.map((id) => Number(id));
	const { messages, totalPages } = await getConversations(
		coversationTrackerUsers,
		page
	);

	return (
		<div className="flex flex-col gap-5">
			<h1 className="place-self-center py-5 text-center text-xl font-bold sm:text-5xl">
				<p className="pb-1">Conversation Tracker</p>
			</h1>
			<div className="flex max-w-[90%] flex-wrap justify-center self-center sm:max-w-[50%]">
				{coversationTrackerUsers.map((userId) => (
					<UserBadge key={userId} userId={userId} />
				))}
				<AddUsers type="icon" />
			</div>
			<AllConversationMessagesPage
				data={{ messages, totalPages }}
				page={page}
			/>
		</div>
	);
}

import getConversations from './getConversations';
import AllConversationMessagesPage from './AllConversationMessages';
import UserBadge from './UserBadge';
import { cookies } from 'next/headers';
import AddUsers from './AddUsers';
export default async function Page({
	searchParams
}: {
	searchParams: { page: string };
}) {
	const page = Number(searchParams.page) || 1;
	const conversationTrackerCookie = cookies().get('conversationTracker')?.value;
	if (!conversationTrackerCookie) {
		return (
			<div className="flex flex-col gap-5">
				<h1 className="place-self-center py-5 text-center text-xl font-bold sm:text-5xl">
					<p className="pb-1">Conversation Tracker</p>
				</h1>
				<p className="text-center">You have no users selected to track.</p>
				<AddUsers />
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
			<div className="flex justify-center">
				{coversationTrackerUsers.map((userId) => (
					<UserBadge key={userId} userId={userId} />
				))}
			</div>
			<AllConversationMessagesPage
				data={{ messages, totalPages }}
				page={page}
			/>
		</div>
	);
}

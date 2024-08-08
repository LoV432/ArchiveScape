//TODO: This does work but i really shouldn't be making API calls for this. This should be done on the client side.
'use server';
import { cookies } from 'next/headers';

export async function adduserToConversationTrackerCookie(userId: number) {
	if (isNaN(userId) || userId < 1) return;
	const userIdString = userId.toString();
	const cookie = cookies().get('conversationTracker')?.value;
	if (!cookie) {
		cookies().set('conversationTracker', userIdString, {
			path: '/',
			maxAge: 60 * 60 * 24 * 30
		});
		return;
	}
	const cookieArray = cookie.split(',');
	if (!cookieArray.includes(userIdString)) {
		cookies().set('conversationTracker', cookie + ',' + userIdString, {
			path: '/',
			maxAge: 60 * 60 * 24 * 30
		});
	}
}

export async function addMutlipleUsersToConversationTrackerCookie(
	userIds: number[]
) {
	const sanitizedUserIds = userIds.filter((id) => !isNaN(id) && id > 0);
	const cookie = cookies().get('conversationTracker')?.value;
	if (!cookie) {
		cookies().set('conversationTracker', sanitizedUserIds.join(','), {
			path: '/',
			maxAge: 60 * 60 * 24 * 30
		});
		return;
	}
	const cookieArray = cookie.split(',');
	for (const userId of sanitizedUserIds) {
		if (!cookieArray.includes(userId.toString())) {
			cookies().set('conversationTracker', cookie + ',' + userId.toString(), {
				path: '/',
				maxAge: 60 * 60 * 24 * 30
			});
		}
	}
}

export async function removeuserFromConversationTrackerCookie(userId: number) {
	if (isNaN(userId) || userId < 1) return;
	const userIdString = userId.toString();
	const cookie = cookies().get('conversationTracker')?.value;
	if (!cookie) {
		return;
	}
	const cookieArray = cookie.split(',');
	if (cookieArray.includes(userIdString)) {
		cookies().set(
			'conversationTracker',
			cookieArray.filter((id) => id !== userIdString).join(','),
			{
				path: '/',
				maxAge: 60 * 60 * 24 * 30
			}
		);
	}
}

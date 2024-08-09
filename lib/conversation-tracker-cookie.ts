export function adduserToConversationTrackerCookie(userId: number) {
	if (!document) return;
	if (isNaN(userId) || userId < 1) return;
	const userIdString = userId.toString();
	const cookie = getCookie();
	if (!cookie) {
		setCookie(userIdString);
		return;
	}
	const cookieArray = cookie.split(',');
	if (!cookieArray.includes(userIdString)) {
		setCookie(cookie + ',' + userIdString);
	}
}

export function addMutlipleUsersToConversationTrackerCookie(userIds: number[]) {
	if (!document) return;
	const sanitizedUserIds = userIds.filter((id) => !isNaN(id) && id > 0);
	const cookie = getCookie();
	if (!cookie) {
		setCookie(sanitizedUserIds.join(','));
		return;
	}
	const cookieArray = cookie.split(',');
	for (const userId of sanitizedUserIds) {
		if (!cookieArray.includes(userId.toString())) {
			setCookie(cookie + ',' + userId.toString());
		}
	}
}

export function removeuserFromConversationTrackerCookie(userId: number) {
	if (!document) return;
	if (isNaN(userId) || userId < 1) return;
	const userIdString = userId.toString();
	const cookie = getCookie();
	if (!cookie) {
		return;
	}
	const cookieArray = cookie.split(',');
	if (cookieArray.includes(userIdString)) {
		setCookie(cookieArray.filter((id) => id !== userIdString).join(','));
	}
}

function getCookie() {
	if (!document) return;
	const allCookies = document.cookie.split(';');
	for (const cookie of allCookies) {
		const [key, value] = cookie.split('=');
		if (key.includes('conversationTracker')) {
			return decodeURIComponent(value);
		}
	}
	return undefined;
}

function setCookie(value: string) {
	if (!document) return;
	document.cookie = `conversationTracker=${value};path=/;max-age=2592000`;
}

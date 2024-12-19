'use client';

import {
	useQuery,
	QueryClient,
	QueryClientProvider
} from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';

const queryClient = new QueryClient();
const allowedPaths =
	/^\/(all-messages|search|stats\/links|users\/\d+\/messages|conversation-tracker)$/;

export default function OutdatedIndicator() {
	const [isOutdated, setIsOutdated] = useState(false);
	const [latestIdFromServer, setLatestIdFromServer] = useState<number | null>(
		null
	);

	const pathname = usePathname();
	if (!pathname.match(allowedPaths)) {
		return <></>;
	}

	return (
		<QueryClientProvider client={queryClient}>
			<OutdatedIndicatorWithQuery
				isOutdated={isOutdated}
				setIsOutdated={setIsOutdated}
				latestIdFromServer={latestIdFromServer}
				setLatestIdFromServer={setLatestIdFromServer}
			/>
		</QueryClientProvider>
	);
}

function OutdatedIndicatorWithQuery({
	isOutdated,
	setIsOutdated,
	latestIdFromServer,
	setLatestIdFromServer
}: {
	isOutdated: boolean;
	setIsOutdated: React.Dispatch<React.SetStateAction<boolean>>;
	latestIdFromServer: number | null;
	setLatestIdFromServer: React.Dispatch<React.SetStateAction<number | null>>;
}) {
	const { isError, refetch } = useQuery({
		queryKey: ['latestMessage'],
		queryFn: async () => {
			const res = await fetch('/api/last-message-id');
			const data = (await res.json()) as { id: number };
			setLatestIdFromServer(data.id);
			return data.id;
		},
		refetchInterval: 1000 * 60,
		refetchOnWindowFocus: 'always',
		enabled: !isOutdated
	});

	function createUpdateToast() {
		toast('New messages found, Do you want to update?', {
			actionButtonStyle: {
				fontSize: '1.1rem',
				fontWeight: 500,
				padding: '15px'
			},
			style: {
				color: 'white',
				fontSize: '1rem'
			},
			position: 'bottom-right',
			action: {
				onClick: async () => {
					const { data } = await refetch();
					if (!data) return;
					setCookie(data);
					setIsOutdated(false);
					location.reload();
				},
				label: 'Update'
			}
		});
	}

	useEffect(() => {
		const currentCookie = getCookie();
		if (!currentCookie || isOutdated) {
			setIsOutdated(false);
		}

		const keepCookieFreshInterval = setInterval(() => {
			const currentCookie = getCookie();
			if (currentCookie !== null) {
				setCookie(currentCookie);
			}
		}, 1000 * 10);
		return () => {
			if (keepCookieFreshInterval) {
				clearInterval(keepCookieFreshInterval);
			}
		};
	}, []);

	useEffect(() => {
		const currentLocalCookie = getCookie();
		if (latestIdFromServer === null) {
			return;
		}
		let cookieSetTimeout: NodeJS.Timeout | null = null;
		if (currentLocalCookie === null) {
			cookieSetTimeout = setTimeout(() => {
				// We delay the inital cookie add because i don't want to pin the DB if the user quickly opens and closes the page
				setCookie(latestIdFromServer);
			}, 1000 * 10);
		} else if (currentLocalCookie !== latestIdFromServer) {
			setIsOutdated(true);
		}
		return () => {
			if (cookieSetTimeout) {
				clearTimeout(cookieSetTimeout);
			}
		};
	}, [latestIdFromServer]);

	if (isError) return <></>;
	if (isOutdated) {
		return (
			<div
				role="button"
				onClick={createUpdateToast}
				className="fixed bottom-10 right-10 z-50 h-fit w-fit cursor-pointer"
			>
				<div className="pulsating-circle"></div>
			</div>
		);
	}
	return <></>;
}

function setCookie(id: number) {
	if (typeof id !== 'number' || Number.isNaN(id)) return;
	if (process.env.NODE_ENV === 'development') {
		document.cookie = `localLastId=${id};path=/;samesite=lax;max-age=240`;
	} else {
		document.cookie = `localLastId=${id};path=/;samesite=lax;secure;max-age=240`;
	}
}

function getCookie() {
	const cookies = document.cookie.split(';');
	for (const cookie of cookies) {
		const [key, value] = cookie.split('=');
		if (key.includes('localLastId')) {
			if (Number.isNaN(parseInt(value))) return null;
			return parseInt(value);
		}
	}
	return null;
}

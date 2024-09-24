'use client';

import {
	useQuery,
	QueryClient,
	QueryClientProvider
} from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';
import { LocalLastIdContext } from './LocalLastIdContext';

const queryClient = new QueryClient();
const allowedPaths =
	/^\/(all-messages|search|stats\/links|users\/\d+\/messages|conversation-tracker)$/;

export default function OutdatedIndicator({
	children
}: {
	children: React.ReactNode;
}) {
	const [isOutdated, setIsOutdated] = useState(false);
	const [localLastId, setLocalLastId] = useState<number | null>(null);
	const pathname = usePathname();
	if (!pathname.match(allowedPaths)) {
		return children;
	}
	return (
		<QueryClientProvider client={queryClient}>
			<OutdatedIndicatorWithQuery
				isOutdated={isOutdated}
				setIsOutdated={setIsOutdated}
				localLastId={localLastId}
				setLocalLastId={setLocalLastId}
			/>
			<LocalLastIdContext.Provider value={localLastId}>
				{children}
			</LocalLastIdContext.Provider>
		</QueryClientProvider>
	);
}

function OutdatedIndicatorWithQuery({
	isOutdated,
	setIsOutdated,
	localLastId,
	setLocalLastId
}: {
	isOutdated: boolean;
	setIsOutdated: React.Dispatch<React.SetStateAction<boolean>>;
	localLastId: number | null;
	setLocalLastId: React.Dispatch<React.SetStateAction<number | null>>;
}) {
	const keepCookieFreshInterval = useRef<NodeJS.Timeout | null>(null);
	const localLastIdRef = useRef<number | null>(localLastId);
	const { isError, refetch } = useQuery({
		queryKey: ['latestMessage'],
		queryFn: async () => {
			const res = await fetch('/api/last-message-id');
			const data = (await res.json()) as { id: number };
			handleNewData(data.id);
			return data.id;
		},
		refetchInterval: 1000 * 60,
		enabled: !isOutdated
	});

	useEffect(() => {
		// On page load, we sync the ref and state with the cookie
		const currentCookie = getCookie();
		updateLocalLastId(currentCookie);
	}, []);

	useEffect(() => {
		// This effect takes care of keeping the cookie fresh when the ID is outdated
		if (!isOutdated) {
			if (keepCookieFreshInterval.current) {
				clearInterval(keepCookieFreshInterval.current);
			}
			return;
		}
		keepCookieFreshInterval.current = setInterval(() => {
			if (isOutdated && localLastIdRef.current !== null) {
				setCookie(localLastIdRef.current);
			}
		}, 1000 * 10);
		return () => {
			if (keepCookieFreshInterval.current) {
				clearInterval(keepCookieFreshInterval.current);
			}
		};
	}, [isOutdated]);

	function updateLocalLastId(id: number | null) {
		localLastIdRef.current = id;
		setLocalLastId(localLastIdRef.current);

		if (!localLastIdRef.current) return;
		const currentCookie = getCookie();
		if (currentCookie === null) {
			if (isOutdated) {
				// This is triggered when the cookie has expired but the user hasn't left the site so the isOutdated is still true
				setIsOutdated(false);
			}
			setTimeout(() => {
				// We delay the inital cookie add because i don't want to pin the DB if the user quickly opens and closes the page
				if (!localLastIdRef.current) return;
				setCookie(localLastIdRef.current as number);
			}, 1000 * 10);
		}
	}

	function handleNewData(data: number | null | undefined) {
		if (!data) return;
		if (localLastIdRef.current === null) {
			// This will set the inital cookie
			updateLocalLastId(data);
			return;
		}

		if (localLastIdRef.current === data) {
			// This is to keep cookie from expiring while the id is not outdated
			// Once its outdated, keepCookieFreshInterval ref keeps the cookie fresh
			setCookie(localLastIdRef.current);
			return;
		}

		if (localLastIdRef.current !== data && !isOutdated) {
			setIsOutdated(true);
		}
	}

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

	if (isError) return;
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
}

function setCookie(id: number) {
	if (typeof id !== 'number' || Number.isNaN(id)) return;
	if (process.env.NODE_ENV === 'development') {
		document.cookie = `localLastId=${id};path=/;samesite=lax;max-age=120`;
	} else {
		document.cookie = `localLastId=${id};path=/;samesite=lax;secure;max-age=120`;
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

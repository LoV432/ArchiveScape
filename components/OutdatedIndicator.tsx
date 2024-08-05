'use client';

import {
	useQuery,
	QueryClient,
	QueryClientProvider
} from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';

const queryClient = new QueryClient();
const allowedPaths =
	/^\/(all-messages|search|stats\/links|users\/\d+\/messages)$/;

export default function OutdatedIndicator() {
	const [isOutdated, setIsOutdated] = useState(false);
	const pathname = usePathname();
	if (!pathname.match(allowedPaths)) return;
	return (
		<QueryClientProvider client={queryClient}>
			<OutdatedIndicatorWithQuery
				isOutdated={isOutdated}
				setIsOutdated={setIsOutdated}
			/>
		</QueryClientProvider>
	);
}

function OutdatedIndicatorWithQuery({
	isOutdated,
	setIsOutdated
}: {
	isOutdated: boolean;
	setIsOutdated: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const firstCookieInterval = useRef<NodeJS.Timeout | null>(null);
	const localLastId = useRef<number | null>(null);
	const { data, isError, dataUpdatedAt } = useQuery({
		queryKey: ['latestMessage'],
		queryFn: async () => {
			const res = await fetch('/api/last-message-id');
			const data = await res.json();
			return data.id;
		},
		refetchInterval: 1000 * 60,
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
				onClick: () => {
					setCookie(data);
					location.reload();
				},
				label: 'Update'
			}
		});
	}

	useEffect(() => {
		const cookies = document.cookie.split(';');
		for (const cookie of cookies) {
			const [key, value] = cookie.split('=');
			if (key === 'localLastId') {
				localLastId.current = parseInt(value);
			}
		}
		if (!data) return;
		if (localLastId.current === null) {
			firstCookieInterval.current = setInterval(() => {
				localLastId.current = data;
				setCookie(data);
			}, 1000 * 10);
		} else if (localLastId.current !== data) {
			setIsOutdated(true);
		}
		return () => {
			if (firstCookieInterval.current) {
				clearInterval(firstCookieInterval.current);
			}
		};
	}, [dataUpdatedAt]);

	useEffect(() => {
		let coookieUpdateInterval: NodeJS.Timeout | null = null;
		if (isOutdated) {
			if (localLastId.current === null) return;
			setCookie(localLastId.current);
			coookieUpdateInterval = setInterval(() => {
				if (localLastId.current === null) return;
				setCookie(localLastId.current);
			}, 1000 * 60);
		}
		return () => {
			if (coookieUpdateInterval) {
				clearInterval(coookieUpdateInterval);
			}
		};
	}, [isOutdated]);

	if (isError) return;
	if (isOutdated) {
		return (
			<div
				onClick={createUpdateToast}
				className="fixed bottom-10 right-10 z-50 h-fit w-fit cursor-pointer"
			>
				<div className="pulsating-circle"></div>
			</div>
		);
	}
}

function setCookie(id: number) {
	if (process.env.NODE_ENV === 'development') {
		document.cookie = `localLastId=${id};path=/;samesite=lax;max-age=120`;
	} else {
		document.cookie = `localLastId=${id};path=/;samesite=lax;secure;max-age=120`;
	}
}

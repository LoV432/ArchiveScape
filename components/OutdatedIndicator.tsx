'use client';

import {
	useQuery,
	QueryClient,
	QueryClientProvider
} from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

const queryClient = new QueryClient();

export default function OutdatedIndicator() {
	return (
		<QueryClientProvider client={queryClient}>
			<OutdatedIndicatorWithQuery />
		</QueryClientProvider>
	);
}

function OutdatedIndicatorWithQuery() {
	const localLastId = useRef<number | null>(null);
	const [isOutdated, setIsOutdated] = useState(false);
	const { data, isError } = useQuery({
		queryKey: ['latestMessage'],
		queryFn: async () => {
			const res = await fetch('/api/last-message-id');
			const data = await res.json();
			return data.id;
		},
		refetchInterval: 1000 * 60 * 4
	});
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
			localLastId.current = data;
			setCookie(data);
		} else if (localLastId.current !== data) {
			// This keeps the max-age cookie from expiring
			setCookie(localLastId.current);
			setIsOutdated(true);
		}
	}, [data]);
	if (isError) return;
	if (isOutdated) {
		return (
			<div className="fixed bottom-10 right-10 h-fit w-fit cursor-pointer">
				<div className="pulsating-circle"></div>
			</div>
		);
	}
}

function setCookie(id: number) {
	if (process.env.NODE_ENV === 'development') {
		document.cookie = `localLastId=${id};path=/;samesite=lax;max-age=720`;
	} else {
		document.cookie = `localLastId=${id};path=/;samesite=lax;secure;max-age=720`;
	}
}

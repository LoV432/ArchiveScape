'use client';
import { use, useEffect, useState } from 'react';

export function FirstLastSeenText({
	firstLastSeen,
	isFirstSeen
}: {
	firstLastSeen: Promise<{ firstSeen: string; lastSeen: string } | null>;
	isFirstSeen: boolean;
}) {
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		setIsReady(true);
	}, []);

	if (!isReady) {
		return <span className="block min-w-40">Loading...</span>;
	}
	const dateObject = use(firstLastSeen);
	if (!dateObject) {
		return <span className="block min-w-40">Something went wrong</span>;
	}
	if (isFirstSeen) {
		return <>{new Date(dateObject.firstSeen).toLocaleString()}</>;
	}

	return <>{new Date(dateObject.lastSeen).toLocaleString()}</>;
}

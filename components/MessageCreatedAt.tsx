'use client';
import { useEffect, useState } from 'react';

export function MessageCreatedAt({ time }: { time: string }) {
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		setIsReady(true);
	}, []);

	if (!isReady) {
		return null;
	}
	return (
		<p className="float-right text-sm text-gray-500">
			{new Date(time).toLocaleString('en-PK', {
				year: '2-digit',
				month: 'short',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric'
			})}
		</p>
	);
}

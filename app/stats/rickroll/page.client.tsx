'use client';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ClientPage({ time }: { time: Date }) {
	const [dateTime, setDateTime] = useState(
		time.toLocaleString('ur-PK', {
			dateStyle: 'full',
			timeStyle: 'short',
			timeZone: 'UTC'
		})
	);
	const [isCorrectTime, setIsCorrectTime] = useState(false);
	useEffect(() => {
		setDateTime(
			time.toLocaleString('ur-PK', { dateStyle: 'full', timeStyle: 'short' })
		);
		setIsCorrectTime(true);
	}, [time]);
	return (
		<div className="relative">
			<p className={`${isCorrectTime ? '' : 'opacity-0'}`}>{dateTime}</p>
			<Skeleton
				className={`absolute left-0 top-0 h-full w-full rounded-full ${isCorrectTime ? 'hidden' : ''}`}
			/>
		</div>
	);
}

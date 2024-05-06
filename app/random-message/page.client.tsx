'use client';

import LoadingOverlay from '@/components/LoadingOverlay';
import { useQuery } from '@tanstack/react-query';
import { Metadata } from 'next/types';
import { useEffect, useRef, useState } from 'react';

export const metadata: Metadata = {
	title: 'Random Message | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/'
};

type RandomMessage = {
	message: string;
	color: string;
};

export default function RandomMessage() {
	const updateMessageInterval = useRef<NodeJS.Timeout>();
	const [nextFetch, setNextFetch] = useState([0] as number[]);
	const timerCircleRef = useRef<SVGCircleElement>(null);
	const query = useQuery({
		queryKey: ['random-message'],
		queryFn: async () => {
			const res = await fetch('/api/random-message');
			if (!res.ok) {
				throw new Error('Error');
			}
			const response = (await res.json()) as RandomMessage;
			// We are adding timestamp to force rerender.
			// Otherwise it will fail to rerender if last message and current message had the same length
			setNextFetch([response.message.length * 30 + 5000, new Date().getTime()]);
			return response;
		},
		refetchOnWindowFocus: false,
		placeholderData: undefined,
		initialData: undefined,
		gcTime: 0
	});
	useEffect(() => {
		clearTimeout(updateMessageInterval.current);
		updateMessageInterval.current = setTimeout(() => {
			query.refetch();
		}, nextFetch[0]);
		restartAnimation(timerCircleRef, nextFetch[0] / 1000);
		return () => {
			clearTimeout(updateMessageInterval.current);
		};
	}, [nextFetch]);
	if (query.isLoading) return <LoadingOverlay />;
	if (query.isError) return <p>Error</p>;
	return (
		<div className="mx-auto px-10 pt-24 text-center sm:pt-44">
			<div id="countdown" className="relative h-8 w-full pb-24 text-center">
				<svg className="mx-auto h-[40px] w-[40px]">
					<circle
						style={{ stroke: query.data?.color || 'white' }}
						ref={timerCircleRef}
						r="18"
						cx="20"
						cy="20"
					></circle>
				</svg>
			</div>
			<p
				style={{ color: query.data?.color }}
				className="break-words text-4xl font-extrabold sm:text-7xl"
			>
				{query.data?.message}
			</p>
		</div>
	);
}

function restartAnimation(
	timerCircleRef: React.RefObject<SVGCircleElement>,
	time: number
) {
	timerCircleRef.current && (timerCircleRef.current.style.animation = 'none');
	timerCircleRef.current && timerCircleRef.current.getBBox();
	timerCircleRef.current &&
		(timerCircleRef.current.style.animation = `countdown ${time}s linear forwards`);
}

'use client';

import LoadingOverlay from '@/components/LoadingOverlay';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

type RandomMessage = {
	message: string;
	color: string;
};

export default function Page() {
	let updateMessageInterval: NodeJS.Timeout;
	const [nextFetch, setNextFetch] = useState(5000);
	const timerCircleRef = useRef<SVGCircleElement>(null);
	const query = useQuery({
		queryKey: ['random-message'],
		queryFn: async () => {
			const res = await fetch('/api/random-message');
			if (!res.ok) {
				throw new Error('Error');
			}
			const response = (await res.json()) as RandomMessage;
			setNextFetch(response.message.length * 30 + 5000);
			return response;
		},
		placeholderData: (prev) => prev
	});
	useEffect(() => {
		clearTimeout(updateMessageInterval);
		updateMessageInterval = setTimeout(() => {
			query.refetch();
		}, nextFetch);
		restartAnimation(timerCircleRef, nextFetch / 1000);
		return () => {
			clearTimeout(updateMessageInterval);
		};
	}, [nextFetch]);
	if (!query.data) return <LoadingOverlay />;
	return (
		<>
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
		</>
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

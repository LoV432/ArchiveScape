'use client';
import { RandomMessage as RandomMessageType } from '@/lib/random-message';
import { Metadata } from 'next/types';
import { useEffect, useRef, useState } from 'react';

export const metadata: Metadata = {
	title: 'Random Message | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/'
};

export default function RandomMessage({
	message_text,
	color_name,
	messageTime
}: {
	message_text: string;
	color_name: string;
	messageTime: number;
}) {
	const updateMessageInterval = useRef<NodeJS.Timeout>();
	const [triggerEffect, setTriggerEffect] = useState(true);
	const timerCircleRef = useRef<SVGCircleElement>(null);
	const messagesListRef = useRef([
		{ message_text, color_name, messageTime }
	] as {
		message_text: string;
		color_name: string;
		messageTime: number;
	}[]);
	// At this point we have a prefetched message from ssr
	useEffect(() => {
		// Add 1 extra messsage as buffer
		addNewMessage(messagesListRef);
	}, []);

	useEffect(() => {
		clearTimeout(updateMessageInterval.current);
		// Set the timer for the next message
		updateMessageInterval.current = setTimeout(() => {
			messagesListRef.current.shift();
			addNewMessage(messagesListRef);
			// Retrigger the effect after this one is finished
			setTriggerEffect(!triggerEffect);
		}, messagesListRef.current[0].messageTime);
		// The animation doesn't start automatically
		// This starts the animation on initial mount
		// Then restarts it whenever this effect is triggered again
		restartAnimation(
			timerCircleRef,
			messagesListRef.current[0].messageTime / 1000
		);
		return () => {
			clearTimeout(updateMessageInterval.current);
		};
	}, [triggerEffect]);
	return (
		<div className="mx-auto px-10 pt-24 text-center sm:pt-44">
			<div id="countdown" className="relative h-8 w-full pb-24 text-center">
				<svg className="mx-auto h-[40px] w-[40px]">
					<circle
						style={{ stroke: messagesListRef.current[0].color_name || 'white' }}
						ref={timerCircleRef}
						r="18"
						cx="20"
						cy="20"
					></circle>
				</svg>
			</div>
			<p
				style={{ color: messagesListRef.current[0].color_name || 'white' }}
				className="break-words text-4xl font-extrabold sm:text-7xl"
			>
				{messagesListRef.current[0].message_text}
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

async function addNewMessage(messagesListRef: any) {
	const res = await fetch('/api/random-message');
	if (!res.ok) {
		throw new Error('Error');
	}
	const response = (await res.json()) as RandomMessageType;
	const newItem = {
		message_text: response.message_text,
		color_name: response.color_name,
		messageTime: response.message_text.length * 30 + 5000
	};
	messagesListRef.current = [...messagesListRef.current, newItem];
}

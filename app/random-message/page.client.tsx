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
	const [activeMessage, setActiveMessage] = useState({
		message_text,
		color_name,
		messageTime
	});
	const timerCircleRef = useRef<SVGCircleElement>(null);
	const messagesListRef = useRef([
		{ message_text, color_name, messageTime }
	] as {
		message_text: string;
		color_name: string;
		messageTime: number;
	}[]);

	useEffect(() => {
		addNewMessage();
		restartAnimation();
	}, []);
	return (
		<div className="mx-auto max-w-[99vw] px-10 pt-24 text-center sm:pt-44">
			<div
				onAnimationEnd={nextMessage}
				id="countdown"
				className="relative h-8 w-full pb-24 text-center"
			>
				<svg className="mx-auto h-[40px] w-[40px]">
					<circle
						style={{ stroke: activeMessage.color_name || 'white' }}
						ref={timerCircleRef}
						r="18"
						cx="20"
						cy="20"
					></circle>
				</svg>
			</div>
			<p
				style={{ color: activeMessage.color_name || 'white' }}
				className="break-words text-3xl font-extrabold sm:text-7xl"
			>
				{activeMessage.message_text}
			</p>
		</div>
	);

	async function nextMessage() {
		if (messagesListRef.current.length === 1) {
			// If there is only one message, it means the new message is still being fetched.
			// So we wait for the new message to be fetched before calling nextMessage again.
			setTimeout(() => {
				nextMessage();
			}, 200);
			return;
		}
		await new Promise((r) => setTimeout(r, 200));
		messagesListRef.current.shift();
		setActiveMessage(messagesListRef.current[0]);
		restartAnimation();
		addNewMessage();
	}

	function restartAnimation() {
		timerCircleRef.current && (timerCircleRef.current.style.animation = 'none');
		timerCircleRef.current && timerCircleRef.current.getBBox();
		timerCircleRef.current &&
			(timerCircleRef.current.style.animation = `countdown ${messagesListRef.current[0].messageTime / 1000}s linear forwards`);
	}

	async function addNewMessage() {
		const errorMessage = {
			message_text: 'Error: Failed to fetch random message.',
			color_name: 'red',
			messageTime: 5000
		};
		try {
			const res = await fetch('/api/random-message');
			if (!res.ok) {
				messagesListRef.current = [...messagesListRef.current, errorMessage];
				return;
			}
			const response = (await res.json()) as RandomMessageType;
			const newItem = {
				message_text: response.message_text,
				color_name: response.color_name,
				messageTime: response.message_text.length * 30 + 5000
			};
			messagesListRef.current = [...messagesListRef.current, newItem];
		} catch (error) {
			messagesListRef.current = [...messagesListRef.current, errorMessage];
		}
	}
}

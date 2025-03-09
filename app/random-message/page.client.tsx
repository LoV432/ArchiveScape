'use client';
import { RandomMessage as RandomMessageType } from '@/lib/random-message';
import { Quote } from 'lucide-react';
import { Metadata } from 'next/types';
import { useEffect, useRef, useState } from 'react';
import useCounter from './useCounter';

export const metadata: Metadata = {
	title: 'Random Message | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/'
};

export default function RandomMessage({
	initialMessage
}: {
	initialMessage: {
		message_text: string;
		color_name: string;
		messageTime: number;
		id: number;
	};
}) {
	const [activeMessage, setActiveMessage] = useState(initialMessage);
	const messagesListRef = useRef([initialMessage] as {
		message_text: string;
		color_name: string;
		messageTime: number;
		id: number;
	}[]);
	const { count, setCount, countEnded } = useCounter(
		initialMessage.messageTime
	);

	useEffect(() => {
		addNewMessage();
	}, []);

	useEffect(() => {
		if (countEnded) {
			nextMessage();
		}
	}, [countEnded]);
	return (
		<div className="my-auto grid h-[80%]">
			<div className="mx-auto place-self-start bg-white p-2 text-center font-bold text-black sm:text-2xl">
				Archive Entry #{activeMessage.id}
			</div>
			<div
				style={{ color: activeMessage.color_name || 'white' }}
				className="relative mx-auto max-w-[90vw] place-self-center"
			>
				<div className="absolute -left-4 -top-4">
					<Quote className="h-4 rotate-180 sm:h-10" />
				</div>
				<div className="absolute -right-4 bottom-4">
					<Quote className="h-4 sm:h-10" />
				</div>
				<p className="mb-8 max-w-[1000px] px-8 py-4 text-center text-xl font-bold sm:text-4xl">
					{activeMessage.message_text}
				</p>
			</div>
			<div className="bold mx-auto place-self-end sm:text-2xl">
				Next Message in: {count}s
			</div>
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
		await new Promise((r) => setTimeout(r, 1000));
		messagesListRef.current.shift();
		setActiveMessage(messagesListRef.current[0]);
		setCount(activeMessage.messageTime);
		addNewMessage();
	}

	async function addNewMessage() {
		const errorMessage = {
			message_text: 'Error: Failed to fetch random message.',
			color_name: 'red',
			messageTime: 5000,
			id: 6969696969
		};
		try {
			const res = await fetch('/api/random-message');
			if (!res.ok) {
				messagesListRef.current = [...messagesListRef.current, errorMessage];
				return;
			}
			const response = (await res.json()) as RandomMessageType;
			let time = Math.floor(response.message_text.length / 10);
			time = time < 9 ? 9 : time;
			const newItem = {
				message_text: response.message_text,
				color_name: response.color_name,
				messageTime: Math.floor(time),
				id: response.id
			};
			messagesListRef.current = [...messagesListRef.current, newItem];
		} catch (error) {
			messagesListRef.current = [...messagesListRef.current, errorMessage];
		}
	}
}

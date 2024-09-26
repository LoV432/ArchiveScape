'use client';
import { RandomMessage as RandomMessageType } from '@/lib/random-message';
import { Quote } from 'lucide-react';
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
	const messagesListRef = useRef([
		{ message_text, color_name, messageTime }
	] as {
		message_text: string;
		color_name: string;
		messageTime: number;
	}[]);
	const [countdown, setCountdown] = useState(messageTime);
	const [startCountDown, setStartCountDown] = useState(true);

	useEffect(() => {
		addNewMessage();
	}, []);

	useEffect(() => {
		const timerInterval = setInterval(() => {
			setCountdown((prevTime) => {
				if (prevTime === 0) {
					clearInterval(timerInterval);
					nextMessage();
					return 0;
				} else {
					return prevTime - 1;
				}
			});
		}, 1000);
		return () => clearInterval(timerInterval);
	}, [startCountDown]);
	return (
		<>
			<div
				style={{ color: activeMessage.color_name || 'white' }}
				className="relative m-auto flex max-w-[90vw] flex-col"
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
			<div className="bold absolute bottom-5 mt-14 w-full text-center sm:text-2xl">
				Next Message in: {countdown}s
			</div>
		</>
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
		await new Promise((r) => setTimeout(r, 10));
		messagesListRef.current.shift();
		setActiveMessage(messagesListRef.current[0]);
		setCountdown(messagesListRef.current[0].messageTime);
		setStartCountDown(!startCountDown);
		addNewMessage();
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
			let time = Math.floor(response.message_text.length / 10);
			time = time < 9 ? 9 : time;
			const newItem = {
				message_text: response.message_text,
				color_name: response.color_name,
				messageTime: Math.floor(time)
			};
			messagesListRef.current = [...messagesListRef.current, newItem];
		} catch (error) {
			messagesListRef.current = [...messagesListRef.current, errorMessage];
		}
	}
}

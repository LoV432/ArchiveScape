'use client';
import { useEffect } from 'react';

export default function ScrollIntoView({ messageId }: { messageId: number }) {
	useEffect(() => {
		const selectedMessage = document.querySelector(`#id-${messageId}`);
		if (selectedMessage) {
			selectedMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}, []);
	return <></>;
}

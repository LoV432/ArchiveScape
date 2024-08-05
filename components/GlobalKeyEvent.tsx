'use client';

import { useEffect } from 'react';

export default function GlobalKeyEvent() {
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			document.querySelector('html')?.setAttribute('data-cursor', 'true');
		}
	}
	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, []);
	return null;
}

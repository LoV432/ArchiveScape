'use client';

import { useEffect } from 'react';

export default function GlobalKeyEvent() {
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			document
				.querySelector<HTMLElement>(':root')
				?.style.setProperty('--cursor', 'url(/cursor-cat.cur), auto');
			document
				.querySelector<HTMLElement>(':root')
				?.style.setProperty(
					'--cursor-pointer',
					'url(/cursor-cat-pointer.cur), pointer'
				);
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

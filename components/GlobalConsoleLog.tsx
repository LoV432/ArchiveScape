'use client';

import { Cat } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function GlobalKeyEvent() {
	useEffect(() => {
		console.log(
			`With silent grace, I guard the past,\nIn ancient lands, my worship vast.\nIn archives now, I watch and see,\nThe secrets kept, they're safe with me.\nI wait in shadows, calm and still,\nType my name, your search to fulfill.`
		);
	}, []);
	useEffect(() => {
		if (document.cookie.includes('disclaimer=true')) return;
		toast.success('This website is NOT created by the VentScape dev.', {
			richColors: true,
			duration: 10000,
			position: 'bottom-right',
			style: {
				fontSize: '0.9rem'
			},
			action: {
				label: (
					<>
						<Cat /> &nbsp;I Understand
					</>
				),
				onClick: () => {}
			},
			actionButtonStyle: {
				paddingTop: '20px',
				paddingBottom: '20px',
				fontSize: '0.9rem'
			}
		});
		document.cookie = 'disclaimer=true; max-age=31536000; path=/; samesite=lax';
	}, []);
	return null;
}

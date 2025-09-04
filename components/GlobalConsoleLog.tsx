'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

export default function GlobalKeyEvent() {
	useEffect(() => {
		console.log(
			`With silent grace, I guard the past,\nIn ancient lands, my worship vast.\nIn archives now, I watch and see,\nThe secrets kept, they're safe with me.\nI wait in shadows, calm and still,\nType my name, your search to fulfill.`
		);
	}, []);
	useEffect(() => {
		if (document.cookie.includes('deathnotice=true')) return;
		toast.error(
			<div>
				<h1 className="text-base font-bold">ArchiveScape is dead.</h1>
				<p>
					The archive is no longer being updated following the return of the
					original creator of{' '}
					<a
						className="underline underline-offset-4"
						href="https://ventscape.life"
						target="_blank"
					>
						VentScape
					</a>
					.
				</p>
			</div>,
			{
				richColors: true,
				duration: 10000000,
				position: 'bottom-right',
				style: {
					fontSize: '0.9rem'
				},
				onDismiss: () => {
					document.cookie =
						'deathnotice=true; max-age=31536000; path=/; samesite=lax';
				},
				actionButtonStyle: {
					paddingTop: '20px',
					paddingBottom: '20px',
					fontSize: '0.9rem'
				}
			}
		);
	}, []);
	return null;
}

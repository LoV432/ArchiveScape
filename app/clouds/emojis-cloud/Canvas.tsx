'use client';
import { Chart, LinearScale, Tooltip } from 'chart.js';
import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Canvas({
	emojis
}: {
	emojis: { x: string; y: number }[];
}) {
	const emojisRef = useRef(emojis);
	const router = useRouter();
	const canvasRef = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		if (window.matchMedia('(max-width: 768px)').matches) {
			const maxCount = Math.max(
				...Object.values(emojisRef.current).map((d) => d.y)
			);
			const normalizationFactor = 70 / maxCount;
			emojisRef.current = emojisRef.current
				.slice(0, 100)
				.map((d) => ({ x: d.x, y: Math.round(d.y * normalizationFactor) }));
		}

		Chart.register(WordCloudController, WordElement, LinearScale, Tooltip);
		const chart = new Chart(
			canvasRef.current?.getContext('2d') as CanvasRenderingContext2D,
			{
				type: 'wordCloud',
				data: {
					labels: emojisRef.current.map((d) => d.x),
					datasets: [
						{
							data: emojisRef.current,
							fit: true,
							parsing: false,
							padding: 5,
							rotate: 0,
							maxRotation: 0,
							minRotation: 0,
							autoGrow: {
								maxTries: 1,
								scalingFactor: 1.2
							}
						}
					]
				},
				options: {
					onClick(_, elements) {
						if (!elements[0]?.index) return;
						router.push(`/search?search=${emojis[elements[0].index].x}`);
					},
					layout: {
						padding: 10
					},
					plugins: {
						tooltip: {
							enabled: true
						}
					}
				}
			}
		);
		return () => {
			chart.destroy();
		};
	});
	return (
		<div className="mx-auto grid h-5/6 w-[95vw] justify-center sm:place-self-center">
			<canvas ref={canvasRef} id="word-cloud"></canvas>
		</div>
	);
}

'use client';
import { Chart, LinearScale } from 'chart.js';
import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Canvas({
	words
}: {
	words: { x: string; y: number }[];
}) {
	const wordsRef = useRef(words);
	const router = useRouter();
	const canvasRef = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		if (window.matchMedia('(max-width: 768px)').matches) {
			const maxCount = Math.max(
				...Object.values(wordsRef.current).map((d) => d.y)
			);
			const normalizationFactor = 70 / maxCount;
			wordsRef.current = wordsRef.current
				.slice(0, 100)
				.map((d) => ({ x: d.x, y: Math.round(d.y * normalizationFactor) }));
		}

		Chart.register(WordCloudController, WordElement, LinearScale);
		const chart = new Chart(
			canvasRef.current?.getContext('2d') as CanvasRenderingContext2D,
			{
				type: 'wordCloud',
				data: {
					labels: wordsRef.current.map((d) => d.x),
					datasets: [
						{
							data: wordsRef.current,
							fit: true,
							normalized: true,
							parsing: false,
							padding: 5,
							rotate: 0,
							maxRotation: 0,
							minRotation: 0,
							family: 'mono',
							autoGrow: {
								maxTries: 1,
								scalingFactor: 1.2
							}
						}
					]
				},
				options: {
					onClick(_, elements) {
						router.push(`/search?search=${words[elements[0].index].x}`);
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

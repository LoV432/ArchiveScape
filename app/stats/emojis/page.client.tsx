'use client';
import { useEffect, useRef } from 'react';
import {
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	Chart,
	BarController
} from 'chart.js';

export default function EmojiBar({
	labels,
	dataset
}: {
	labels: string[];
	dataset: { label: string; data: number[]; backgroundColor: string };
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		let xFrontSize = 30;
		if (window.matchMedia('(max-width: 768px)').matches) {
			xFrontSize = 15;
		}
		Chart.register(
			CategoryScale,
			LinearScale,
			BarElement,
			Title,
			Tooltip,
			Legend,
			BarController
		);
		const chart = new Chart(
			canvasRef.current?.getContext('2d') as CanvasRenderingContext2D,
			{
				type: 'bar',
				data: {
					labels: labels,
					datasets: [
						{
							data: dataset.data,
							backgroundColor: dataset.backgroundColor,
							label: dataset.label
						}
					]
				},
				options: {
					responsive: true,
					indexAxis: 'x' as const,
					scales: {
						x: {
							ticks: {
								font: {
									size: xFrontSize
								}
							},
							grid: {
								color: 'RGBA(255,255,255,0.15)'
							}
						},
						y: {
							ticks: {
								font: {
									size: 15
								},
								color: 'white'
							},
							grid: {
								color: 'RGBA(255,255,255,0.15)'
							}
						}
					},
					plugins: {
						legend: {
							position: 'top' as const,
							labels: {
								color: 'white'
							}
						},
						title: {
							display: false
						}
					}
				}
			}
		);
		return () => {
			Chart.unregister(
				CategoryScale,
				LinearScale,
				BarElement,
				Title,
				Tooltip,
				Legend,
				BarController
			);
			chart.destroy();
		};
	});

	return (
		<main className="mx-auto flex h-full w-[90vw] max-w-[1000px] flex-col justify-center">
			<canvas ref={canvasRef} id="emoji"></canvas>
		</main>
	);
}

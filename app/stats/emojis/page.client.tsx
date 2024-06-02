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
	dataset: { label: string; data: number[]; backgroundColor: string }[];
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		let xFrontSize = 15;
		let aspectRatio = 2;
		let yFrontSize = 15;
		let boxWidth = 40;
		if (window.matchMedia('(max-width: 768px)').matches) {
			labels = labels.slice(0, 7);
			dataset = dataset.slice(0, 7);
			aspectRatio = 1;
			boxWidth = 20;
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
					labels,
					datasets: dataset
				},
				options: {
					aspectRatio: aspectRatio,
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
							},
							stacked: true
						},
						y: {
							ticks: {
								font: {
									size: yFrontSize
								},
								color: 'white'
							},
							grid: {
								color: 'RGBA(255,255,255,0.15)'
							},
							stacked: true
						}
					},
					plugins: {
						legend: {
							position: 'top' as const,
							labels: {
								color: 'white',
								boxWidth: boxWidth
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

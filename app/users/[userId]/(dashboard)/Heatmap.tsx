'use client';

import { use, useRef } from 'react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@/components/ui/tooltip';
import { HeatmapData } from './heatmap-data';

export default function Heatmap({
	heatmapData
}: {
	heatmapData: Promise<HeatmapData>;
}) {
	const startDate = new Date(new Date().getFullYear(), 0, 1);
	const startOfYear = startDate.getDay();
	const dateRef = useRef(startDate);
	function getCellDate(cellIndex: number) {
		const date = new Date(dateRef.current);
		const actualIndex = cellIndex - startOfYear;
		date.setDate(date.getDate() + actualIndex);
		return date;
	}
	function getCount(index: number) {
		const date = getCellDate(index);
		return (
			use(heatmapData).find((data) => data.date.getTime() === date.getTime())
				?.count || 0
		);
	}
	function getColor(index: number) {
		const count = getCount(index);
		if (count === 0) {
			return 'bg-green-950 opacity-30';
		}
		if (count < 20) {
			return 'bg-green-900';
		} else if (count < 30) {
			return 'bg-green-800';
		} else if (count < 60) {
			return 'bg-green-700';
		} else if (count < 80) {
			return 'bg-green-600';
		} else if (count < 100) {
			return 'bg-green-500';
		} else {
			return 'bg-green-400';
		}
	}
	return (
		<div className="mx-auto w-fit max-w-[100vw] overflow-scroll rounded-sm border p-4 shadow-md">
			<div className="flex gap-[35px] pl-7">
				<div className="text-center">Jan</div>
				<div className="text-center">Feb</div>
				<div className="text-center">Mar</div>
				<div className="text-center">Apr</div>
				<div className="text-center">May</div>
				<div className="text-center">Jun</div>
				<div className="text-center">Jul</div>
				<div className="text-center">Aug</div>
				<div className="text-center">Sep</div>
				<div className="text-center">Oct</div>
				<div className="text-center">Nov</div>
				<div className="text-center">Dec</div>
			</div>
			<div className="flex flex-row gap-2">
				<div className="grid grid-rows-[repeat(7,10px)] gap-1">
					<p className="text-center"></p>
					<p className="-mt-2 text-center text-[15px]">Mon</p>
					<p className="text-center"></p>
					<p className="-mt-2 text-center text-[15px]">Wed</p>
					<p className="text-center"></p>
					<p className="-mt-2 text-center text-[15px]">Fri</p>
					<p className="text-center"></p>
				</div>
				<div className="grid grid-flow-col grid-cols-[repeat(53,10px)] grid-rows-[repeat(7,10px)] gap-1">
					{Array.from({ length: 365 + startOfYear }).map((_, i) => (
						<TooltipProvider key={i}>
							<Tooltip delayDuration={100}>
								<TooltipTrigger>
									<div
										key={i}
										className={`h-full w-full cursor-default rounded-[2px] border border-green-800 ${i >= startOfYear ? getColor(i) : 'opacity-0'}`}
									/>
								</TooltipTrigger>
								<TooltipContent>
									<p>
										{getCount(i)} messages on{' '}
										{getCellDate(i).toLocaleDateString('en-US', {
											month: 'short',
											day: 'numeric',
											year: 'numeric'
										})}
									</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					))}
				</div>
			</div>
		</div>
	);
}

export function HeatMapLoading() {
	return (
		<div className="mx-auto grid h-[152px] w-full max-w-3xl place-items-center rounded-sm border p-4 shadow-md">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="animate-spin"
			>
				<path d="M21 12a9 9 0 1 1-6.219-8.56" />
			</svg>
		</div>
	);
}

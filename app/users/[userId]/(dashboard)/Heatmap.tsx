'use client';

import { use, useEffect, useState } from 'react';
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger
} from '@/components/ui/hover-card';
import { HeatmapData } from './heatmap-data';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Heatmap({
	heatmapData,
	selectedYear
}: {
	heatmapData: HeatmapData;
	selectedYear?: number;
}) {
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		setLoading(false);
	}, []);
	if (loading) {
		return <HeatMapLoading />;
	}
	const today = DateTime.now();
	const { years, data } = use(heatmapData);
	const firstDateOfYear = DateTime.fromObject({
		year: selectedYear || Number(years[0]),
		month: 1,
		day: 1
	}) as DateTime<true>;
	const firstDayOfYear = firstDateOfYear.weekday;
	const heatmapDict = data.reduce(
		(acc, curr) => {
			acc[curr.date.toISOString().slice(0, 10)] = curr.count;
			return acc;
		},
		{} as Record<string, number>
	);
	function getCellDate(cellIndex: number) {
		const daysToAdd = cellIndex - firstDayOfYear;
		const newDate = firstDateOfYear.plus({ days: daysToAdd });
		return newDate;
	}
	function getCount(index: number) {
		const date = getCellDate(index);
		const count = heatmapDict[date.toISODate()] || 0;
		// if (count) {
		// 	const countDate = use(heatmapData).find(
		// 		(data) => data.date.toISOString().slice(0, 10) === date.toISODate()
		// 	)?.date;
		// 	console.log(countDate?.toISOString().slice(0, 10), date);
		// }
		return count;
	}
	function getColor(index: number) {
		if (index < firstDayOfYear) {
			return 'opacity-0';
		}
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
		<>
			<div className="mx-auto mb-2 mt-12 w-fit max-w-[90vw] rounded-sm border p-4 shadow-md">
				<div className="overflow-auto">
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
							{Array.from({ length: 366 + firstDayOfYear }).map((_, i) =>
								getCount(i) > 0 ? (
									<CellWithCount
										key={i}
										count={getCount(i)}
										date={getCellDate(i)}
										color={getColor(i)}
										isToday={getCellDate(i).toISODate() === today.toISODate()}
									/>
								) : (
									<button
										key={i}
										className={`h-full w-full !cursor-default rounded-[2px] border border-green-800 ${i >= firstDayOfYear ? 'opacity-30' : 'opacity-0'} ${getCellDate(i).toISODate() === today.toISODate() ? 'animate-[pulse-current-day_3s_ease-in-out_infinite] !opacity-100' : ''}`}
									/>
								)
							)}
						</div>
					</div>
				</div>
			</div>
			<div className="mb-6 flex flex-row-reverse justify-center gap-5">
				{years.length > 1 &&
					years.map((year) => (
						<Link
							scroll={false}
							key={year}
							href={`?year=${year}`}
							className={`text-center text-sm font-medium text-gray-500 hover:text-gray-700`}
						>
							<Button
								variant="outline"
								className={`${firstDateOfYear.year === Number(year) ? 'border-white border-opacity-50 text-white' : ''}`}
							>
								{year}
							</Button>
						</Link>
					))}
			</div>
		</>
	);
}

export function HeatMapLoading() {
	return (
		<div className="mx-auto my-12 grid h-[152px] max-w-3xl place-items-center overflow-auto rounded-sm border p-4 shadow-md">
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

function CellWithCount({
	count,
	date,
	color,
	isToday
}: {
	count: number;
	date: DateTime<true>;
	color: string;
	isToday: boolean;
}) {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<HoverCard
			openDelay={200}
			closeDelay={200}
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<HoverCardTrigger asChild>
				<button
					className={`h-full w-full !cursor-default rounded-[2px] border border-green-800 ${color} ${isToday ? 'animate-[pulse-current-day_3s_ease-in-out_infinite]' : ''}`}
				/>
			</HoverCardTrigger>
			<HoverCardContent
				onMouseEnter={() => setIsOpen(false)}
				onMouseLeave={() => setIsOpen(false)}
				side="top"
				className="w-fit"
			>
				<p>
					{count} messages on {date.toLocaleString(DateTime.DATE_FULL)}
				</p>
			</HoverCardContent>
		</HoverCard>
	);
}

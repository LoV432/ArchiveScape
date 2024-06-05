'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover';

export function DatePickerWithRange({
	date,
	setDate
}: {
	date?: DateRange;
	setDate: (date: DateRange | undefined) => void;
}) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="ionicon h-full w-full"
					viewBox="0 0 512 512"
				>
					<path
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="32"
						d="M32 144h448M112 256h288M208 368h96"
					/>
				</svg>
			</PopoverTrigger>
			<PopoverContent className="w-[330px] p-0" align="start">
				<div
					id="date"
					className={cn(
						'flex w-full justify-center p-4 font-normal',
						!date && 'text-muted-foreground'
					)}
				>
					<CalendarIcon className="mr-2 mt-1 h-4 w-4" />
					{date?.from ? (
						date.to ? (
							<>
								{format(date.from, 'LLL dd, y')} -{' '}
								{format(date.to, 'LLL dd, y')}
							</>
						) : (
							format(date.from, 'LLL dd, y')
						)
					) : (
						<span>Pick a date</span>
					)}
				</div>
				<div className="flex w-full justify-center">
					<Calendar
						className="w-full"
						initialFocus
						mode="range"
						defaultMonth={date?.from}
						selected={date}
						onSelect={setDate}
						numberOfMonths={1}
					/>
				</div>
			</PopoverContent>
		</Popover>
	);
}

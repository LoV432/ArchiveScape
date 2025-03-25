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
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';
import { ListFilter } from 'lucide-react';

export function Filters() {
	const [isOpen, setIsOpen] = useState(false);
	const [date, setDate] = useState<DateRange | undefined>({
		from: undefined,
		to: undefined
	});
	const [order, setOrder] = useState<'asc' | 'desc'>('desc');
	const [dateStartParams, setDateStartParams] = useState<string>('');
	const [dateEndParams, setDateEndParams] = useState<string>('');
	const [orderParams, setOrderParams] = useState<string>('');
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	function applyFilter() {
		let params: string = '';
		searchParams.forEach((value, key) => {
			if (
				key !== 'page' &&
				key !== 'order' &&
				key !== 'dateStart' &&
				key !== 'dateEnd'
			) {
				params += `&${key}=${value}`;
			}
		});
		router.push(
			`${pathname}?${params}${dateStartParams}${dateEndParams}${orderParams}`
		);
		setIsOpen(false);
	}
	useEffect(() => {
		setOrder(searchParams.get('order') === 'asc' ? 'asc' : 'desc');
		const dateStart = searchParams.get('dateStart');
		const dateEnd = searchParams.get('dateEnd');
		if (dateStart && dateEnd) {
			setDate({
				from: new Date(dateStart),
				to: new Date(dateEnd)
			});
		} else if (dateStart) {
			setDate({
				from: new Date(dateStart),
				to: undefined
			});
		} else {
			setDate(undefined);
		}
	}, [searchParams]);
	useEffect(() => {
		date?.from
			? setDateStartParams(`&dateStart=${date.from.toISOString()}`)
			: setDateStartParams('');
		if (date?.to) {
			let dateEnd = new Date(date.to);
			setDateEndParams(
				`&dateEnd=${new Date(dateEnd.setHours(23, 59, 59)).toISOString()}`
			);
		} else {
			setDateEndParams('');
		}
	}, [date]);
	useEffect(() => {
		if (order !== 'asc' && order !== 'desc') return;
		setOrderParams(`&order=${order}`);
	}, [order]);
	return (
		<Popover open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
			<PopoverTrigger asChild>
				<div
					role="button"
					className={`grid h-full w-[45px] place-items-center rounded hover:bg-accent active:bg-accent ${isOpen ? 'bg-accent' : ''} cursor-pointer text-muted-foreground`}
				>
					<ListFilter className="h-full w-6" />
				</div>
			</PopoverTrigger>
			<PopoverContent className="flex w-[330px] flex-col gap-5" align="start">
				<div className="flex flex-col gap-2 text-center">
					<p>Time Filter:</p>
					<DatePickerWithRange date={date} setDate={setDate} />
				</div>
				<div className="flex flex-col gap-2 text-center">
					<p>Order by:</p>
					<RadioGroup
						onValueChange={(value) => setOrder(value as 'asc' | 'desc')}
						value={order}
						className="flex flex-row justify-center gap-5"
					>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="desc" id="option-one" />
							<Label htmlFor="option-one">DESC</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="asc" id="option-two" />
							<Label htmlFor="option-two">ASC</Label>
						</div>
					</RadioGroup>
				</div>
				<Button onClick={applyFilter} className="w-full">
					Apply
				</Button>
			</PopoverContent>
		</Popover>
	);
}

function DatePickerWithRange({
	date,
	setDate
}: {
	date?: DateRange;
	setDate: (date: DateRange | undefined) => void;
}) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<div className="flex w-full justify-center font-normal">
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
			</PopoverTrigger>
			<PopoverContent className="w-[330px] p-0" align="start">
				<div
					id="date"
					className={cn('flex w-full justify-center font-normal')}
				></div>
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

'use client';
import { useRouter } from 'next13-progressbar';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from './DatePicker.client';
import { DateRange } from 'react-day-picker';

export default function SearchBar({
	searchQuery,
	preSelectedDateStart,
	preSelectedDateEnd
}: {
	searchQuery: string;
	preSelectedDateStart: Date | undefined;
	preSelectedDateEnd: Date | undefined;
}) {
	const searchElementRef = useRef<HTMLInputElement>(null);
	const router = useRouter();
	const [date, setDate] = useState<DateRange | undefined>({
		from: preSelectedDateStart,
		to: preSelectedDateEnd
	});
	const [dateStart, setDateStart] = useState<string>('');
	const [dateEnd, setDateEnd] = useState<string>('');
	useMemo(() => {
		date?.from
			? setDateStart(`&dateStart=${date.from.toISOString()}`)
			: setDateStart('');
		if (date?.to) {
			let dateEnd = new Date(date.to);
			setDateEnd(
				`&dateEnd=${new Date(dateEnd.setHours(23, 59, 59)).toISOString()}`
			);
		} else {
			setDateEnd('');
		}
	}, [date]);
	useEffect(() => {
		document.addEventListener('keydown', (e) => {
			if (e.key === '`' || e.key === '/') {
				setTimeout(() => {
					searchElementRef.current?.focus();
				}, 10);
			}
		});
		if ('ontouchstart' in window) {
			searchElementRef.current?.setAttribute('placeholder', 'Search');
		} else {
			searchElementRef.current?.focus();
		}
	}, []);
	return (
		<>
			<div className="relative mx-auto my-10 flex h-14 w-full max-w-[800px] px-4 sm:w-2/3 sm:px-0">
				<div className="flex w-full gap-5">
					<div className="ml-2 block h-full w-10 py-2 sm:absolute sm:left-0">
						<DatePickerWithRange date={date} setDate={setDate} />
					</div>
					<input
						type="text"
						placeholder="Search"
						className="h-full w-full rounded border border-gray-300 border-opacity-35 text-center text-2xl font-bold focus-visible:border-opacity-70 focus-visible:outline-none"
						defaultValue={searchQuery}
						onFocus={(e) =>
							e.target.setAttribute('placeholder', 'Start typing...')
						}
						onBlur={(e) => e.target.setAttribute('placeholder', 'Search')}
						ref={searchElementRef}
						onKeyUp={(e: any) => {
							if (e.key === 'Enter') {
								router.push(
									`/search?search=${e.target.value}${dateStart}${dateEnd}`
								);
							}
						}}
					/>
				</div>
				<div className="absolute right-0 top-0 hidden h-full w-16 p-2 sm:block">
					<Button
						onClick={() =>
							router.push(`/search?search=${searchElementRef.current?.value}`)
						}
						className="h-full w-full rounded bg-transparent text-3xl text-white hover:bg-zinc-800"
					>
						⏎
					</Button>
				</div>
			</div>
		</>
	);
}

'use client';
import { useRouter } from 'next13-progressbar';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from './DatePicker.client';
import { DateRange } from 'react-day-picker';
import cursorUpdate from './cursor-update';

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
	function search() {
		const searchValue = searchElementRef.current?.value;
		if (!searchValue) return;
		cursorUpdate(searchValue);
		router.push(`/search?search=${searchValue}${dateStart}${dateEnd}`);
	}
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
				<input
					type="text"
					placeholder="Search"
					className="peer order-2 h-full w-full border border-x-0 border-gray-300 border-opacity-35 bg-[rgb(18,18,18)] text-center text-2xl font-bold focus-visible:border-opacity-70 focus-visible:outline-none"
					defaultValue={searchQuery}
					onFocus={(e) =>
						e.target.setAttribute('placeholder', 'Start typing...')
					}
					onBlur={(e) => e.target.setAttribute('placeholder', 'Search')}
					ref={searchElementRef}
					onKeyUp={(e) => {
						if (e.key === 'Enter') {
							search();
						}
					}}
				/>
				<div className="order-l h-full rounded-l border border-r-0 border-gray-300 border-opacity-35 bg-[rgb(18,18,18)] p-2 peer-focus-visible:border-opacity-70 peer-focus-visible:outline-none">
					<DatePickerWithRange date={date} setDate={setDate} />
				</div>
				<div className="order-3 h-full rounded-r border border-l-0 border-gray-300 border-opacity-35 bg-[rgb(18,18,18)] p-2 peer-focus-visible:border-opacity-70 peer-focus-visible:outline-none">
					<Button
						onClick={search}
						className="h-full w-full rounded bg-transparent px-3 text-3xl text-white hover:bg-zinc-800"
					>
						⏎
					</Button>
				</div>
			</div>
		</>
	);
}

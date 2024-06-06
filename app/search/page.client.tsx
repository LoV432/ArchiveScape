'use client';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNewerMessages,
	PaginationOlderMessages
} from '@/components/ui/pagination';
import { useRouter } from 'next13-progressbar';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import cat from '@/public/cat.gif';
import scribble from '@/public/scribble.gif';
import Image from 'next/image';
import GoToPageEllipsis from '@/components/GoToPageEllipsis';
import dynamic from 'next/dynamic';
import LoadingTable from '@/components/LoadingTable';
const MessageSection = dynamic(() => import('./messages.client'), {
	ssr: false,
	loading: () => <LoadingTable />
});
import { Message } from '@/lib/all-messages';
import { DatePickerWithRange } from './datepicker.client';
import { DateRange } from 'react-day-picker';

export default function SearchPage({
	data,
	searchQuery,
	page,
	preSelectedDateStart,
	preSelectedDateEnd
}: {
	data: { messages: Message[]; totalPages: number };
	page: number;
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
			<div className="relative mx-auto mt-10 block h-14 w-2/3 max-w-[800px]">
				<div className="absolute -left-16 top-0 ml-2 block h-full w-10 py-2 sm:left-0">
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
			{data.messages.length === 0 && (
				<div className="flex flex-col place-items-center gap-4">
					{searchQuery !== '' && (
						<>
							<p className="text-xl font-semibold">No results :(</p>
							<Image
								unoptimized
								src={scribble}
								alt="no search results"
								width={200}
								height={200}
							/>
						</>
					)}
					{searchQuery === '' && (
						<Image
							unoptimized
							src={cat}
							alt="cat waiting patiently"
							width={400}
							height={400}
						/>
					)}
				</div>
			)}
			{data.messages.length > 0 && (
				<>
					<MessageSection messages={data.messages} />
					{data.totalPages > 1 && (
						<PaginationSection
							searchQuery={searchQuery}
							page={page}
							totalPages={data.totalPages}
							dateStart={dateStart}
							dateEnd={dateEnd}
						/>
					)}
				</>
			)}
		</>
	);
}

function PaginationSection({
	searchQuery,
	page,
	totalPages,
	dateStart,
	dateEnd
}: {
	searchQuery: string;
	page: number;
	totalPages: number;
	dateStart: string;
	dateEnd: string;
}) {
	return (
		<Pagination className="place-self-end pb-7">
			<PaginationContent>
				<PaginationItem>
					<PaginationNewerMessages
						isActive={!(page === 1)}
						href={`/search?search=${searchQuery}&page=${page - 1 >= 1 ? page - 1 : page}${dateStart}${dateEnd}`}
						className={`${
							page === 1 ? 'cursor-not-allowed' : 'cursor-pointer'
						} select-none`}
					/>
				</PaginationItem>
				<PaginationItem>
					<PaginationLink className="cursor-pointer">{page}</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<GoToPageEllipsis link={`/search?search=${searchQuery}`} />
				</PaginationItem>
				<PaginationItem>
					<PaginationOlderMessages
						isActive={!(page === totalPages)}
						href={`/search?search=${searchQuery}&page=${page + 1 > totalPages ? page : page + 1}${dateStart}${dateEnd}`}
						className={`${
							page === totalPages ? 'cursor-not-allowed' : 'cursor-pointer'
						} select-none`}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}

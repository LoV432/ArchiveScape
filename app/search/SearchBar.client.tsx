'use client';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Filters } from '../../components/Filters';
import cursorUpdate from './cursor-update';
import { useSearchParams, useRouter } from 'next/navigation';

export default function SearchBar({ searchQuery }: { searchQuery: string }) {
	const searchElementRef = useRef<HTMLInputElement>(null);
	const router = useRouter();
	const searchParams = useSearchParams();
	function search() {
		const searchValue = searchElementRef.current?.value;
		if (!searchValue) return;
		cursorUpdate(searchValue);
		let params: string = '';
		searchParams.forEach((value, key) => {
			if (key !== 'search' && key !== 'page') {
				params += `&${key}=${value}`;
			}
		});
		router.push(`/search?search=${searchValue}${params}`);
	}
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
					<Filters />
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

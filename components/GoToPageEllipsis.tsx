'use client';
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover';
import { PaginationEllipsis } from '@/components/ui/pagination';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function GoToPageEllipsis() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	let params: string = '';
	searchParams.forEach((value, key) => {
		if (key !== 'page') {
			params += `&${key}=${value}`;
		}
	});
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Popover onOpenChange={() => setIsOpen(!isOpen)} open={isOpen}>
			<PopoverTrigger
				aria-label="Go To Page"
				onClick={() => setIsOpen(!isOpen)}
			>
				<PaginationEllipsis />
			</PopoverTrigger>
			<PopoverContent className="w-44">
				<input
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							router.push(
								`${pathname}?page=${Number(e.currentTarget.value) || 1}${params}`
							);
							setIsOpen(false);
						}
					}}
					className="h-9 w-full border border-muted text-center"
					placeholder="Go to page"
				/>
			</PopoverContent>
		</Popover>
	);
}

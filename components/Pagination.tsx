'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationButton
} from '@/components/ui/pagination';
import GoToPageEllipsis from '@/components/GoToPageEllipsis';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function MessagesPagination({
	totalPages,
	page,
	type = 'messages',
	initalOrder = 'desc'
}: {
	totalPages: number | 'infinite' | 'positive-infinity';
	page: number;
	type?: 'messages' | 'default';
	initalOrder?: 'asc' | 'desc';
}) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	let params: string = '';
	searchParams.forEach((value, key) => {
		if (key !== 'page') {
			params += `&${key}=${value}`;
		}
	});

	const isInfinite =
		totalPages === 'infinite' || totalPages === 'positive-infinity';
	const isLastPage = isInfinite ? false : page === totalPages;
	const isFirstPage = (() => {
		if (totalPages !== 'infinite' && page === 1) return true;
		return false;
	})();

	let buttonTextFirst, buttonTextLast;
	if (type === 'messages') {
		let order = searchParams.get('order');
		if (order !== 'asc' && order != 'desc') order = initalOrder;
		buttonTextFirst = order === 'asc' ? 'Older' : 'Newer';
		buttonTextLast = order === 'asc' ? 'Newer' : 'Older';
	} else {
		buttonTextFirst = 'Previous';
		buttonTextLast = 'Next';
	}

	let previousPage, nextPage;
	if (isInfinite) {
		previousPage = page - 1;
		nextPage = page + 1;
	} else {
		// Techically, we don't need to check for overflow here because we hide the
		// pagination item if its going to overflow but eh, whatever
		previousPage = page - 1 >= 1 ? page - 1 : page;
		nextPage = page + 1 > totalPages ? page : page + 1;
	}

	return (
		<Pagination className="place-self-end pb-7">
			<PaginationContent>
				<PaginationItem>
					<PaginationButton
						rel="nofollow"
						isActive={!isFirstPage}
						href={`${pathname}?page=${previousPage}${params}`}
						className={`${isFirstPage ? 'pointer-events-none opacity-0' : ''} select-none`}
					>
						<ChevronLeft className="inline h-4 w-4" /> {buttonTextFirst}
					</PaginationButton>
				</PaginationItem>
				<PaginationItem>
					<PaginationLink rel="nofollow" className="pointer-events-none">
						{page}
					</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<GoToPageEllipsis />
				</PaginationItem>
				<PaginationItem>
					<PaginationButton
						rel="nofollow"
						isActive={!isLastPage}
						href={`${pathname}?page=${nextPage}${params}`}
						className={`${isLastPage ? 'pointer-events-none opacity-0' : ''} select-none`}
					>
						{buttonTextLast} <ChevronRight className="inline h-4 w-4" />
					</PaginationButton>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}

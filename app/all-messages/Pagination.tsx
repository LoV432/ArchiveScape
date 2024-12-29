'use client';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink
} from '@/components/ui/pagination';
import GoToPageEllipsis from '@/components/GoToPageEllipsis';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FiltersReducer, FiltersState } from './useFilters';

export function MessagesPagination({
	filters,
	setPage,
	totalPages
}: {
	filters: FiltersState;
	setPage: FiltersReducer;
	totalPages: number;
}) {
	const { page } = filters;
	const isFirstPage = page === 1;
	const isLastPage = page === totalPages;

	let buttonTextFirst, buttonTextLast;
	let order = filters.order || 'desc';
	buttonTextFirst = order === 'asc' ? 'Older' : 'Newer';
	buttonTextLast = order === 'asc' ? 'Newer' : 'Older';

	let previousPage, nextPage;
	previousPage = page - 1 >= 1 ? page - 1 : page;
	nextPage = page + 1;

	return (
		<Pagination className="place-self-end pb-7">
			<PaginationContent>
				<PaginationItem>
					<Button
						onClick={() => {
							window.scrollTo({
								top: 0,
								left: 0,
								behavior: 'instant'
							});
							setPage({ page: previousPage });
						}}
						variant={'outline'}
						className={`${isFirstPage ? 'pointer-events-none opacity-0' : ''} select-none`}
					>
						<ChevronLeft className="inline h-4 w-4" /> {buttonTextFirst}
					</Button>
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
					<Button
						onClick={() => {
							window.scrollTo({
								top: 0,
								left: 0,
								behavior: 'instant'
							});
							setPage({ page: nextPage });
						}}
						variant={'outline'}
						className={`${isLastPage ? 'pointer-events-none opacity-0' : ''} select-none`}
					>
						{buttonTextLast} <ChevronRight className="inline h-4 w-4" />
					</Button>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}

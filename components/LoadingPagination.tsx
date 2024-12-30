import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink
} from '@/components/ui/pagination';

export function LoadingPagination({ page }: { page: number }) {
	return (
		<Pagination className="place-self-end pb-7">
			<PaginationContent>
				<PaginationItem>
					<PaginationLink rel="nofollow" className="pointer-events-none">
						{page}
					</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationEllipsis />
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}

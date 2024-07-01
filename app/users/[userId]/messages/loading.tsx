import { Skeleton } from '@/components/ui/skeleton';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';

export default function Loading() {
	return (
		<div className="grid grid-rows-[min-content,min-content]">
			<h1 className="place-self-center py-5 text-center text-xl font-bold sm:text-5xl">
				<p className="pb-1">All Message From</p>
				<div className="relative mt-1 h-6 w-80 sm:mt-3 sm:w-[700px]">
					<Skeleton
						className={`absolute left-0 top-0 h-full w-full rounded-full`}
					/>
				</div>
			</h1>
			<Table className="mx-auto max-w-3xl text-base">
				<TableCaption hidden>All Messages</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Messages</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell>
							<p>Loading...</p>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>
	);
}

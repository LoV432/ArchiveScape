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
				<p className="pb-1">All Users</p>
			</h1>
			<Table className="mx-auto max-w-3xl text-base">
				<TableCaption hidden>All Users</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>User Name</TableHead>
						<TableHead className="text-right">Total Messages</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell>
							<p>Loading...</p>
						</TableCell>
						<TableCell className="text-right">
							<p>Loading...</p>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>
	);
}

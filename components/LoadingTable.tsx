import { Loader2 } from 'lucide-react';
import {
	TableCaption,
	TableHeader,
	TableRow,
	TableHead,
	Table
} from './ui/table';
import { Filters } from './Filters';

export function LoadingTable({
	ariaLabel,
	tableHeadValues
}: {
	ariaLabel: string;
	tableHeadValues: string[];
}) {
	return (
		<div className="flex flex-col gap-12">
			<Table className="mx-auto max-w-3xl text-base">
				<TableCaption hidden>{ariaLabel}</TableCaption>
				<TableHeader>
					<TableRow>
						{tableHeadValues.map((value, index) =>
							index === 0 ? (
								<TableHead key={value}>
									<div className="flex flex-row gap-2">
										<Filters />
										{value}
									</div>
								</TableHead>
							) : (
								<TableHead key={value}>{value}</TableHead>
							)
						)}
					</TableRow>
				</TableHeader>
			</Table>
			<div className="flex w-full justify-center">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		</div>
	);
}

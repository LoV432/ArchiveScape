import {
	TableCaption,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
	Table
} from './ui/table';

export default function LoadingTable() {
	return (
		<Table className="mx-auto max-w-3xl">
			<TableCaption>Messages</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead className="w-[150px]">Time</TableHead>
					<TableHead>Message</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow>
					<TableCell className="font-medium">Loading...</TableCell>
					<TableCell className="text-right">Loading...</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	);
}

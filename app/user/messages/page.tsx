'use client';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

export default function UserMessages() {
	const searchParams = useSearchParams();
	const userId = searchParams.get('userId');
	const query = useQuery({
		queryKey: ['user-messages', userId],
		queryFn: async () => {
			const res = await fetch(`/api/user/messages?userId=${userId}`);
			if (!res.ok) {
				throw new Error('Error');
			}
			return (await res.json()) as {
				id: number;
				messageText: string;
				createdAt: number;
			}[];
		},
		initialData: []
	});

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			{query.isError && <p>Error</p>}
			{query.isSuccess && (
				<Table className="cursor-default">
					<TableCaption>Messages</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[500px]">Message</TableHead>
							<TableHead className="text-right">Created At</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{query.data.map((message) => (
							<TableRow key={message.id}>
								<TableCell className="font-medium">
									{message.messageText}
								</TableCell>
								<TableCell className="text-right">
									{new Date(message.createdAt).toLocaleString('en-US', {
										timeStyle: 'short',
										dateStyle: 'short'
									})}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</main>
	);
}

'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { addMutlipleUsersToConversationTrackerCookie } from '@/lib/conversation-tracker-cookie';
import { useRouter } from 'next13-progressbar';

export default function AddUsers() {
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	async function addUsers() {
		setIsLoading(true);
		const userIds = input
			.split(',')
			.map((id) => {
				if (isNaN(parseInt(id))) return;
				if (Number(id) < 1) return;
				return parseInt(id);
			})
			.filter((id) => id !== undefined);
		addMutlipleUsersToConversationTrackerCookie(userIds as number[]);
		router.refresh();
		setIsLoading(false);
	}
	return (
		<Dialog onOpenChange={(open) => open && setInput('')}>
			<DialogTrigger asChild>
				<Button className="mx-auto w-fit" variant="default">
					Add Users
				</Button>
			</DialogTrigger>
			<DialogContent className="w-max max-w-[90vw] translate-y-[-90%]">
				<DialogHeader>
					<DialogTitle>Add Users</DialogTitle>
					<DialogDescription>
						You can add multiple users by comma separating their IDs.
					</DialogDescription>
				</DialogHeader>
				<Input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="User IDs e.g. 27530,27540,27521"
				/>
				<div className="flex justify-center">
					<Button
						disabled={isLoading}
						className="mx-auto w-fit"
						variant="default"
						onClick={() => {
							addUsers();
						}}
					>
						{isLoading ? 'Loading...' : 'Add Users'}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

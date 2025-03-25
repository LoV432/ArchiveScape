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
import { useRouter } from 'nextjs-toploader/app';
import { CirclePlus } from 'lucide-react';

export default function AddUsers({ type }: { type: 'button' | 'icon' }) {
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
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
		setIsOpen(false);
	}
	return (
		<Dialog
			onOpenChange={(status) => {
				status === true && setInput('');
				setIsOpen(!isOpen);
			}}
			open={isOpen}
		>
			<DialogTrigger asChild>
				{type === 'button' ? (
					<Button className="mx-auto w-fit" variant="default">
						Add Users
					</Button>
				) : (
					<div className="my-auto w-fit cursor-pointer">
						<CirclePlus className="h-5 w-5" aria-hidden="true" />
					</div>
				)}
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
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							addUsers();
						}
					}}
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

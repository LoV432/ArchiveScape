'use client';
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover';
import { PaginationEllipsis } from '@/components/ui/pagination';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function GoToPageEllipsis({ link }: { link: string }) {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Popover onOpenChange={() => setIsOpen(!isOpen)} open={isOpen}>
			<PopoverTrigger onClick={() => setIsOpen(!isOpen)}>
				<PaginationEllipsis />
			</PopoverTrigger>
			<PopoverContent className="w-44">
				<input
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							router.push(`${link}&page=${Number(e.currentTarget.value) || 1}`);
							setIsOpen(false);
						}
					}}
					className="h-9 w-full border border-muted text-center"
					placeholder="Go to page"
				/>
			</PopoverContent>
		</Popover>
	);
}

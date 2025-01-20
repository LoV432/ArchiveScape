'use client';

import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { removeuserFromConversationTrackerCookie } from '@/lib/conversation-tracker-cookie';

export default function UserBadge({ userId }: { userId: number }) {
	const router = useRouter();
	return (
		<div className="group p-2">
			<Badge
				className="relative select-none text-base"
				key={userId}
				variant={'secondary'}
			>
				<button
					className={`absolute -right-2 -top-2 hidden rounded-full border border-white p-0.5 text-white group-hover:block`}
					onClick={async () => {
						removeuserFromConversationTrackerCookie(userId);
						router.refresh();
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="12"
						height="12"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
				{userId}
			</Badge>
		</div>
	);
}

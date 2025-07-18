import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';

import { Message } from '@/lib/all-messages';
import { MessageCreatedAt } from '@/components/MessageCreatedAt';
import LinkWithHoverPrefetch from '@/components/LinkWithHoverPrefetch';
import { Filters } from '@/components/Filters';

export function MessagesTable({
	messages,
	userId
}: {
	messages: Message[];
	userId: number;
}) {
	return (
		<>
			<Table className="mx-auto max-w-3xl text-base">
				<TableCaption hidden>Messages</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>
							<div className="flex flex-row gap-2">
								<Filters />
								Message
							</div>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{messages.map((message) => (
						<TableRow key={message.id} className="relative">
							<TableCell
								style={{ color: message.color_name }}
								className="max-w-[150px] break-words pb-2 sm:max-w-[500px]"
							>
								<LinkWithHoverPrefetch
									href={`/users/${userId}/messages/${message.id}/message-context`}
									className="before:absolute before:left-0 before:top-0 before:h-full before:w-full"
								>
									<p>{message.message_text} {message.nickname ?  (
									<>
									- <span className="italic text-sm">{message.nickname}</span>
									</>
								) : ''}</p>
								</LinkWithHoverPrefetch>
								<MessageCreatedAt time={message.created_at} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	);
}

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import TableRowContextMenu from '@/components/TableRowContextMenu';
import { Message } from '@/lib/all-messages';
import { MessageCreatedAt } from '@/components/MessageCreatedAt';
import { Filters } from '@/components/Filters';
import { use } from 'react';

export function MessageSection({
	data,
	highlightedUser
}: {
	data: Promise<{ messages: Message[] }>;
	highlightedUser?: number;
}) {
	const { messages } = use(data);
	return (
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
					<TableRowContextMenu
						key={message.id}
						user_id={message.user_id}
						message_id={message.id}
						isAllMessagesPage
					>
						<TableRow
							tabIndex={0}
							style={{
								// @ts-ignore
								'--highlight': message.color_name
									? `${message.color_name}15`
									: '#FFFFFF15'
							}}
							key={message.id}
							className={`${message.user_id === highlightedUser ? `bg-[--highlight]` : ''}`}
						>
							<TableCell
								style={{ color: message.color_name }}
								className="max-w-[150px] break-words pb-2 sm:max-w-[500px]"
							>
								<p>
									{message.message_text}{' '}
									{message.nickname ? (
										<>
											-{' '}
											<span className="text-sm italic">{message.nickname}</span>
										</>
									) : (
										''
									)}
								</p>
								<MessageCreatedAt time={message.created_at} />
								<p className="float-right text-sm text-gray-500">
									{message.user_id} -&nbsp;
								</p>
							</TableCell>
						</TableRow>
					</TableRowContextMenu>
				))}
			</TableBody>
		</Table>
	);
}

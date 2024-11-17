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
import { mapToHex } from '@/lib/utils';
import { Message } from '@/lib/all-messages';
import { MessageCreatedAt } from '@/components/MessageCreatedAt';
import { Filters } from '@/components/Filters';
import { use } from 'react';
import { Loader2 } from 'lucide-react';

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
								'--highlight': `rgba(${mapToHex[message.color_name] || '255,255,255,0.15'})`
							}}
							className={`${message.user_id === highlightedUser ? `bg-[--highlight] ` : ''}`}
							key={message.id}
						>
							<TableCell
								style={{ color: message.color_name }}
								className="max-w-[150px] break-words pb-2 sm:max-w-[500px]"
							>
								<p>{message.message_text}</p>
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

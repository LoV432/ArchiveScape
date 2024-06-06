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

import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNewerMessages,
	PaginationOlderMessages
} from '@/components/ui/pagination';
import TableRowContextMenu from '@/components/TableRowContextMenu';
import { mapToHex } from '@/lib/utils';
import GoToPageEllipsis from '@/components/GoToPageEllipsis';
import { Message } from '@/lib/all-messages';

export default function AllMessagesPage({
	data,
	page,
	highlightedUser
}: {
	data: { messages: Message[]; totalPages: number };
	page: number;
	highlightedUser: number | null;
}) {
	return (
		<>
			<MessageSection
				messages={data.messages}
				page={page}
				highlightedUser={highlightedUser}
			/>
			<PaginationSection
				totalPages={data.totalPages}
				highlightedUser={highlightedUser}
				page={page}
			/>
		</>
	);
}

function MessageSection({
	messages,
	page,
	highlightedUser
}: {
	messages: Message[];
	page: number;
	highlightedUser: number | null;
}) {
	return (
		<Table className="mx-auto max-w-3xl text-base">
			<TableCaption hidden>Messages</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Time</TableHead>
					<TableHead>Message</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{messages.map((message) => (
					<TableRowContextMenu
						key={message.id}
						user_id={message.user_id}
						message_id={message.id}
						isAllMessagesPage
						isContextPage
						page={page}
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
								className="w-[130px]"
								style={{ color: message.color_name }}
							>
								<div>
									{new Date(message.created_at).toLocaleString('ur-PK', {
										dateStyle: 'short'
									})}
								</div>
								<div>
									{new Date(message.created_at).toLocaleString('ur-PK', {
										timeStyle: 'short'
									})}
								</div>
							</TableCell>
							<TableCell
								style={{ color: message.color_name }}
								className="max-w-[150px] break-words sm:max-w-[500px]"
							>
								{message.message_text}
							</TableCell>
						</TableRow>
					</TableRowContextMenu>
				))}
			</TableBody>
		</Table>
	);
}

function PaginationSection({
	totalPages,
	page,
	highlightedUser
}: {
	totalPages: number;
	page: number;
	highlightedUser: number | null;
}) {
	return (
		<Pagination className="place-self-end pb-7">
			<PaginationContent>
				<PaginationItem>
					<PaginationNewerMessages
						isActive={!(page === 1)}
						href={`/all-messages?user_id=${highlightedUser}&page=${page - 1 >= 1 ? page - 1 : page}`}
						className={`${
							page === 1 ? 'cursor-not-allowed' : 'cursor-pointer'
						} select-none`}
					/>
				</PaginationItem>
				<PaginationItem>
					<PaginationLink className="cursor-pointer">{page}</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<GoToPageEllipsis link={`/all-messages?user_id=${highlightedUser}`} />
				</PaginationItem>
				<PaginationItem>
					<PaginationOlderMessages
						isActive={!(page === totalPages)}
						href={`/all-messages?user_id=${highlightedUser}&page=${page + 1 > totalPages ? page : page + 1}`}
						className={`select-none ${page === totalPages ? 'cursor-not-allowed' : ''}`}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}

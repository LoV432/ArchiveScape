'use client';
import { useSearchParams } from 'next/navigation';
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
	data
}: {
	data: { messages: Message[]; totalPages: number };
}) {
	const searchParams = useSearchParams();
	const page = searchParams.get('page') || '1';
	const highlightedUser = searchParams.get('user_id');
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
	page: string;
	highlightedUser: string | null;
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
						page={Number(page)}
					>
						<TableRow
							tabIndex={0}
							style={{
								// @ts-ignore
								'--highlight': `rgba(${mapToHex[message.color_name] || '255,255,255,0.15'})`
							}}
							className={`${message.user_id === Number(highlightedUser) ? `bg-[--highlight] ` : ''}`}
							key={message.id}
						>
							<TableCell
								className="w-[130px]"
								style={{ color: message.color_name }}
							>
								<div>
									{new Date(message.created_at).toLocaleString('en-US', {
										dateStyle: 'short'
									})}
								</div>
								<div>
									{new Date(message.created_at).toLocaleString('en-US', {
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
	page: string;
	highlightedUser: string | null;
}) {
	return (
		<Pagination className="place-self-end pb-7">
			<PaginationContent>
				<PaginationItem>
					<PaginationNewerMessages
						isActive
						href={`/all-messages?user_id=${highlightedUser}&page=${Number(page) - 1 >= 1 ? Number(page) - 1 : page}`}
						className={`${
							page === '1' ? 'cursor-not-allowed' : 'cursor-pointer'
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
						isActive
						href={`/all-messages?user_id=${highlightedUser}&page=${Number(page) + 1 > totalPages ? page : Number(page) + 1}`}
						className={`select-none`}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}

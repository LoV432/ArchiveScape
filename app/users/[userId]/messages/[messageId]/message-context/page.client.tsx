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
import { useEffect } from 'react';

export default function Main({
	data,
	userId,
	messageId,
	page
}: {
	data: {
		messages: Message[];
		user_name: string;
	};
	userId: number;
	messageId: number;
	page: number;
}) {
	return (
		<>
			<MessageSection
				messages={data.messages}
				userId={userId}
				messageId={messageId}
			/>
			<PaginationSection userId={userId} messageId={messageId} page={page} />
		</>
	);
}

function MessageSection({
	messages,
	userId,
	messageId
}: {
	messages: Message[];
	userId: number;
	messageId: number;
}) {
	useEffect(() => {
		const selectedMessage = document.querySelector(`#id-${messageId}`);
		console.log(selectedMessage);
		if (selectedMessage) {
			selectedMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}, []);
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
						isContextPage
						key={message.id}
						user_id={message.user_id}
						message_id={message.id}
					>
						<TableRow
							id={`id-${message.id.toString()}`}
							tabIndex={0}
							style={{
								// @ts-ignore
								'--highlight': `rgba(${mapToHex[message.color_name] || '255,255,255,0.15'})`
							}}
							key={message.id}
							className={`${message.user_id === userId ? `bg-[--highlight] ` : ''}`}
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
	userId,
	messageId,
	page
}: {
	userId: number;
	messageId: number;
	page: number;
}) {
	return (
		<Pagination className="place-self-end pb-7">
			<PaginationContent>
				<PaginationItem>
					<PaginationOlderMessages
						isActive
						href={`/users/${userId}/messages/${messageId}/message-context?page=${page - 1}`}
						className={`select-none`}
					/>
				</PaginationItem>
				<PaginationItem>
					<PaginationLink className="cursor-pointer">{page}</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<GoToPageEllipsis
						link={`/users/${userId}/messages/${messageId}/message-context?`}
					/>
				</PaginationItem>
				<PaginationItem>
					<PaginationNewerMessages
						isActive
						href={`/users/${userId}/messages/${messageId}/message-context?page=${page + 1}`}
						className={`select-none`}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}

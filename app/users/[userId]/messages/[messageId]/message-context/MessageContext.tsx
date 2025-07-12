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

export function MessageSection({
	messages,
	userId
}: {
	messages: Message[];
	userId: number;
}) {
	return (
		<Table className="mx-auto max-w-3xl text-base">
			<TableCaption hidden>Messages</TableCaption>
			<TableHeader>
				<TableRow>
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
								style={{ color: message.color_name }}
								className="max-w-[150px] break-words pb-2 sm:max-w-[500px]"
							>
								<p>{message.message_text} {message.nickname ?  (
									<>
									- <span className="italic text-sm">{message.nickname}</span>
									</>
								) : ''}</p>
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

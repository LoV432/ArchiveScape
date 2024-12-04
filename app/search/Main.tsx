import { MessagesPagination } from '@/components/Pagination';
import MessagesSection from './MessagesSection';
import { Message } from '@/lib/all-messages';
import SearchBar from './SearchBar.client';
import Image from 'next/image';

export default function SearchPage({
	data,
	searchQuery,
	page
}: {
	data: { messages: Message[]; totalPages: number };
	page: number;
	searchQuery: string;
}) {
	return (
		<>
			<SearchBar searchQuery={searchQuery} />
			{data.messages.length === 0 && (
				<div className="flex flex-col place-items-center gap-4">
					{searchQuery !== '' && (
						<>
							<p className="text-xl font-semibold">No results :(</p>
							<Image
								loading="eager"
								src="/scribble.gif"
								alt="no search results"
								unoptimized
								width={200}
								height={200}
							/>
						</>
					)}
					{searchQuery === '' &&
						(Math.random() * 100 > 5 ? (
							<Image
								loading="eager"
								src="/cat.gif"
								alt="cat waiting patiently"
								unoptimized
								width={400}
								height={400}
							/>
						) : (
							<Image
								loading="eager"
								src="/duck.gif"
								alt="duck being a duck"
								unoptimized
								width={150}
								height={150}
							/>
						))}
				</div>
			)}
			{data.messages.length > 0 && (
				<>
					{data.totalPages > 1 && (
						<MessagesPagination page={page} totalPages={data.totalPages} />
					)}
					<MessagesSection messages={data.messages} />
					{data.totalPages > 1 && (
						<MessagesPagination page={page} totalPages={data.totalPages} />
					)}
				</>
			)}
		</>
	);
}

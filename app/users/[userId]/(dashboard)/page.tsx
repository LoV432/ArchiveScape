import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
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
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MessageCircle, Clock, ArrowDown } from 'lucide-react';
import {
	getFirstLastSeen,
	getTotalMessages,
	getUserName,
	getRecentMessages,
	getAllUsedNicknames
} from './dashboard-data';
import { redirect } from 'next/navigation';
import { Suspense, use } from 'react';
import { Message } from '@/lib/all-messages';
import { MessageCreatedAt } from '@/components/MessageCreatedAt';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FirstLastSeenText } from './FirstLastSeen.client';
import Heatmap, { HeatMapLoading } from './Heatmap';
import { getHeatmapData } from './heatmap-data';
import LinkWithHoverPrefetch from '@/components/LinkWithHoverPrefetch';
import { Metadata } from 'next/types';

export const metadata: Metadata = {
	title: 'User Dashboard | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/',
	robots: {
		index: false,
		follow: false
	}
};

export default async function Page(props: {
	params: Promise<{ userId: string }>;
	searchParams: Promise<{ year?: string }>;
}) {
	const params = await props.params;
	const searchParams = await props.searchParams;
	if (!params.userId || params.userId === '' || isNaN(Number(params.userId))) {
		redirect('/404');
	}
	const selectedYear = Number(searchParams.year) || undefined;
	const userId = parseInt(params.userId);
	const userName = getUserName(userId);
	const firstLastSeen = getFirstLastSeen(userId);
	const totalMessages = getTotalMessages(userId);
	const recentMessages = getRecentMessages(userId);
	const heatmapData = getHeatmapData(userId, selectedYear);
	const allUsedNicknames = getAllUsedNicknames(userId);
	return (
		<div className="container mx-auto p-4">
			<Card className="mx-auto w-full max-w-3xl rounded-none border-l-0 border-r-0 border-t-0">
				<CardHeader className="flex flex-row items-center space-x-4 !pr-0 pb-5">
					<Avatar className="grid h-20 w-20 place-items-center border-2">
						<Suspense>
							<AvatarComponent userName={userName} />
						</Suspense>
						<AvatarFallbackComponent />
					</Avatar>
					<div>
						<div className="flex flex-row items-center gap-4">
							<Suspense
								fallback={
									<CardTitle className="text-2xl sm:min-w-80">
										Loading...
									</CardTitle>
								}
							>
								<CardTitle className="w-32 overflow-hidden text-ellipsis text-2xl sm:w-fit">
									{userName}
								</CardTitle>
							</Suspense>
							<Suspense>
								<BadgeComponent firstLastSeen={firstLastSeen} />
							</Suspense>
						</div>
						<Suspense fallback={<></>}>
							<NicknameSection allUsedNicknames={allUsedNicknames} />
						</Suspense>
						<CardDescription>User Dashboard</CardDescription>
					</div>
				</CardHeader>
				<CardContent className="flex flex-row flex-wrap gap-5 pl-12 sm:justify-center sm:gap-16">
					<div className="flex items-center space-x-2">
						<CalendarDays className="h-4 w-4 text-muted-foreground" />
						<div className="space-y-1">
							<p className="text-sm font-medium leading-none">First seen</p>
							<p className="text-sm text-muted-foreground">
								<Suspense
									fallback={<span className="block min-w-40">Loading...</span>}
								>
									<FirstLastSeenText
										isFirstSeen={true}
										firstLastSeen={firstLastSeen}
									/>
								</Suspense>
							</p>
						</div>
					</div>
					<div className="flex items-center space-x-2">
						<Clock className="h-4 w-4 text-muted-foreground" />
						<div className="space-y-1">
							<p className="text-sm font-medium leading-none">Last seen</p>
							<p className="text-sm text-muted-foreground">
								<Suspense
									fallback={<span className="block min-w-40">Loading...</span>}
								>
									<FirstLastSeenText
										isFirstSeen={false}
										firstLastSeen={firstLastSeen}
									/>
								</Suspense>
							</p>
						</div>
					</div>
					<div className="flex items-center space-x-2">
						<MessageCircle className="h-4 w-4 text-muted-foreground" />
						<div className="space-y-1">
							<p className="text-sm font-medium leading-none">Total messages</p>
							<p className="text-sm text-muted-foreground">
								<Suspense fallback={'Loading...'}>
									<>{totalMessages}</>
								</Suspense>
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
			<Suspense fallback={<HeatMapLoading />}>
				<Heatmap heatmapData={heatmapData} selectedYear={selectedYear} />
			</Suspense>
			<Suspense
				fallback={<div className="flex justify-center">Loading...</div>}
			>
				<MessageSection messages={recentMessages} userId={userId} />
				<Link
					className="flex justify-center pb-4"
					href={`/users/${userId}/messages`}
				>
					<Button variant={'outline'}>View All Messages</Button>
				</Link>
			</Suspense>
		</div>
	);
}

function NicknameSection({
	allUsedNicknames
}: {
	allUsedNicknames: Promise<{ nickname: string }[] | null>;
}) {
	const allUsedNicknamesData = use(allUsedNicknames);
	if (!allUsedNicknamesData || allUsedNicknamesData.length === 0) {
		return <></>;
	}
	return (
		<div className="flex flex-row items-center gap-2">
			<span className="text-muted-foreground">aka</span>
			<span className="inline-block text-sm font-medium text-primary/90">
				{allUsedNicknamesData[0].nickname}
			</span>
			{allUsedNicknamesData.length > 1 ? (
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="h-6 w-6 rounded-full hover:bg-accent hover:text-accent-foreground"
						>
							<ArrowDown className="h-3 w-3" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="max-h-[300px] w-fit overflow-y-auto">
						<div className="flex flex-col gap-3 p-1">
							<p className="border-b pb-2 text-sm font-medium text-muted-foreground">
								Past Nicknames
							</p>
							{allUsedNicknamesData.slice(1).map((nickname) => (
								<div
									key={nickname.nickname}
									className="group flex flex-row items-center gap-2 rounded-md p-2 transition-colors hover:bg-accent/50"
								>
									<span className="text-sm">{nickname.nickname}</span>
								</div>
							))}
						</div>
					</PopoverContent>
				</Popover>
			) : (
				''
			)}
		</div>
	);
}

function AvatarComponent({ userName }: { userName: Promise<string | null> }) {
	return (
		<AvatarImage
			className="h-[70px] w-[70px]"
			src={`/api/image-proxy?url=https://api.dicebear.com/9.x/adventurer/png?seed=${use(userName) || 'UwU'}`}
		/>
	);
}

const asciiFallbacks = ['ʕ·͡ᴥ·ʔ', '◕_◕', '(ಥ﹏ಥ)', '(ÒДÓױ)'];
function AvatarFallbackComponent() {
	return (
		<AvatarFallback className="bg-gradient-to-r from-pink-600 to-blue-400 bg-clip-text font-semibold tracking-wide text-transparent">
			{asciiFallbacks[Math.floor(Math.random() * asciiFallbacks.length)]}
		</AvatarFallback>
	);
}

function BadgeComponent({
	firstLastSeen
}: {
	firstLastSeen: Promise<{ firstSeen: string; lastSeen: string } | null>;
}) {
	const now = new Date().getTime();
	const lastSeen = use(firstLastSeen)?.lastSeen;
	if (!lastSeen) {
		return <></>;
	}
	const lastMessage = new Date(lastSeen).getTime();
	const minutesSinceLastMessage = (now - lastMessage) / (1000 * 60);
	const status = minutesSinceLastMessage < 15 ? 'Active' : 'Offline';
	return (
		<div className="mt-0.5">
			<Badge variant={status === 'Active' ? 'default' : 'outline'}>
				{status}
			</Badge>
		</div>
	);
}

function MessageSection({
	messages,
	userId
}: {
	messages: Promise<Message[] | null>;
	userId: number;
}) {
	const messagesData = use(messages);
	if (!messagesData) {
		return <></>;
	}
	return (
		<Table className="mx-auto max-w-3xl text-base">
			<TableCaption hidden>Recent Messages</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>
						<div className="flex flex-row gap-2">Recent Messages</div>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{messagesData.map((message) => (
					<TableRow tabIndex={0} key={message.id} className="relative">
						<TableCell
							style={{ color: message.color_name }}
							className="max-w-[150px] break-words pb-2 sm:max-w-[500px]"
						>
							<LinkWithHoverPrefetch
								href={`/users/${userId}/messages/${message.id}/message-context`}
								className="before:absolute before:left-0 before:top-0 before:h-full before:w-full"
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
							</LinkWithHoverPrefetch>
							<MessageCreatedAt time={message.created_at} />
							<p className="float-right text-sm text-gray-500">
								{message.user_id} -&nbsp;
							</p>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

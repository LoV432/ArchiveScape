'use client';

import {
	Dispatch,
	RefObject,
	SetStateAction,
	useEffect,
	useMemo,
	useRef,
	useState
} from 'react';
import { Replay } from '../api/replay/route';
import DateTimePicker from '@/components/DateTimePicker';
import { Button } from '@/components/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover';
import MessagesPlayer from './MessagesPlayer';

export default function ReplayPage() {
	const canvas = useRef<HTMLDivElement>(null);
	const [time, setTime] = useState(
		new Date(new Date().getTime() - 1000 * 60 * 60)
	);
	const [messagesInBuffer, setMessagesInBuffer] = useState<Replay[]>([]);
	const messagesPlayer = useMemo(
		() => new MessagesPlayer([], [], setMessagesInBuffer),
		[]
	);

	async function fetchMessages() {
		return messagesPlayer.fetchMessages(time);
	}

	function removeMessageFromBuffer(message: Replay) {
		messagesPlayer.removeMessageFromBuffer(message);
	}

	function messageRendered(message: Replay) {
		messagesPlayer.messageRendered(message);
	}

	function startPlay() {
		messagesPlayer.play();
	}

	useEffect(() => {
		return () => {
			messagesPlayer.cleanUp();
		};
	}, []);

	return (
		<div className="relative grid h-full w-full gap-4">
			<Settings
				time={time}
				setTime={setTime}
				fetchMessage={fetchMessages}
				startPlaying={startPlay}
				isPlaying={messagesPlayer.isPlaying()}
			/>
			<div
				className={`absolute right-0 top-0 mr-5 h-4 w-4 animate-pulse rounded-full bg-red-500 ${!messagesPlayer.isPlaying() && 'hidden'}`}
			></div>
			<div
				ref={canvas}
				id="replay"
				className="relative grid h-full w-full overflow-hidden"
			>
				{messagesInBuffer.map((message) => (
					<Message
						key={message.index}
						canvas={canvas}
						message={message}
						removeFromBuffer={removeMessageFromBuffer}
						messageRendered={messageRendered}
					/>
				))}
			</div>
		</div>
	);
}

function Message({
	canvas,
	message,
	removeFromBuffer,
	messageRendered
}: {
	canvas: RefObject<HTMLDivElement | null>;
	message: Replay;
	removeFromBuffer: (message: Replay) => void;
	messageRendered: (message: Replay) => void;
}) {
	const childElementref = useRef<HTMLDivElement>(null);
	const parentWidth = canvas.current?.clientWidth || 0;
	const parentHeight = canvas.current?.clientHeight || 0;
	const messageReadyRef = useRef(false);
	const [childPosition, setChildPosition] = useState({
		top: Math.floor(Math.random() * parentHeight) + 'px',
		left: Math.floor(Math.random() * parentWidth) + 'px'
	});

	async function playMessage() {
		while (messageReadyRef.current === false) {
			if (!childElementref.current) continue;
			messageReadyRef.current = true;
			if (checkOverflowFromParent()) {
				randomizePosition();
				messageReadyRef.current = false;
				await new Promise((resolve) => setTimeout(resolve, 50));
				continue;
			}
			const allOtherMessages = document.querySelectorAll(
				'.venter'
			) as unknown as HTMLDivElement[];
			for (let i = 0; i < allOtherMessages.length; i++) {
				const el = allOtherMessages[i];
				if (el.id === childElementref.current.id) continue;
				if (checkOverlapBetweenMessages(childElementref.current, el)) {
					randomizePosition();
					messageReadyRef.current = false;
					await new Promise((resolve) => setTimeout(resolve, 50));
					break;
				}
			}
		}
		if (!childElementref.current) return;
		childElementref.current.style.animation = 'venter 10s linear forwards';
		messageRendered(message);
		setTimeout(() => {
			removeFromBuffer(message);
		}, 10000);
	}

	useEffect(() => {
		playMessage();
	}, []);

	return (
		<div
			ref={childElementref}
			style={{
				color: message.color_name || 'white',
				top: childPosition.top,
				left: childPosition.left
			}}
			// TODO: better way to handle font size. It should ideally be based on how big the text is and the size of the parent element
			className="venter absolute max-w-96 p-5 text-center text-xl font-bold opacity-0 lg:text-2xl xl:text-3xl"
			id={`message-${message.index}`}
		>
			{message.message_text}
		</div>
	);

	function checkOverflowFromParent() {
		const parentRect = canvas.current?.getBoundingClientRect();
		const childRect = childElementref.current?.getBoundingClientRect();
		if (!parentRect || !childRect) return false;
		return (
			childRect.top < parentRect.top ||
			childRect.left < parentRect.left ||
			childRect.bottom > parentRect.bottom ||
			childRect.right > parentRect.right
		);
	}

	function checkOverlapBetweenMessages(
		child1: HTMLDivElement,
		child2: HTMLDivElement
	) {
		const child1Rec = child1.getBoundingClientRect();
		const child2Rec = child2.getBoundingClientRect();
		return !(
			child2Rec.right < child1Rec.left ||
			child2Rec.left > child1Rec.right ||
			child2Rec.bottom < child1Rec.top ||
			child2Rec.top > child1Rec.bottom
		);
	}

	function randomizePosition() {
		setChildPosition({
			top: Math.floor(Math.random() * parentHeight) + 'px',
			left: Math.floor(Math.random() * parentWidth) + 'px'
		});
	}
}

function Settings({
	setTime,
	fetchMessage,
	startPlaying,
	time,
	isPlaying
}: {
	setTime: Dispatch<SetStateAction<Date>>;
	fetchMessage: () => Promise<{
		success: boolean;
		error: string | null;
	}>;
	startPlaying: () => void;
	time: Date;
	isPlaying: boolean;
}) {
	const [showSettings, setShowSettings] = useState(false);
	const [fetchResponse, setFetchResponse] = useState<{
		success: Boolean;
		error: String | null;
	}>({ success: true, error: null });
	const [autoFocus, setAutoFocus] = useState(true);
	useEffect(() => {
		if (window.matchMedia('(pointer: coarse)').matches) {
			setAutoFocus(false);
		}
		setShowSettings(true);
	}, []);
	return (
		<>
			{!fetchResponse.success &&
				fetchResponse.error === 'No messages found' && (
					<p className="fixed bottom-20 left-1/2 w-full translate-x-[-50%] p-4 text-center text-rose-900">
						No messages within the timeframe. Please select a different time.
					</p>
				)}
			{!fetchResponse.success &&
				fetchResponse.error !== 'No messages found' && (
					<p className="fixed bottom-20 left-1/2 w-full translate-x-[-50%] p-4 text-center text-rose-900">
						Something went wrong. Please try again.
					</p>
				)}
			<Popover
				onOpenChange={() => setShowSettings(!showSettings)}
				open={showSettings}
			>
				<PopoverTrigger asChild>
					<Button
						onClick={() => setShowSettings(!showSettings)}
						// venter class so the messages don't overlap with this button
						className="venter fixed bottom-11 left-1/2 z-50 translate-x-[-50%] text-center"
						variant={'outline'}
					>
						Settings
					</Button>
				</PopoverTrigger>
				<PopoverContent
					asChild
					onOpenAutoFocus={(e) => {
						if (!autoFocus) e.preventDefault();
					}}
				>
					<div className="grid w-full gap-5">
						<div>
							<p>This feature is very not stable. </p>
							<p> It&apos;s a miracle that it works at all.</p>
						</div>
						<DateTimePicker setTime={setTime} time={time} />
						<Button
							variant={'outline'}
							className="mx-auto w-28"
							onClick={async () => {
								setShowSettings(!showSettings);
								const result = await fetchMessage();
								setFetchResponse(result);
								if (!result.success) return;
								startPlaying();
							}}
						>
							{isPlaying ? 'Restart' : 'Start'}
						</Button>
					</div>
				</PopoverContent>
			</Popover>
		</>
	);
}

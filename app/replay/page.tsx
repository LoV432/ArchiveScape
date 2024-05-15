'use client';

import {
	Dispatch,
	MutableRefObject,
	RefObject,
	SetStateAction,
	useEffect,
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

export default function ReplayPage() {
	const [masterRecord, setMasterRecord] = useState<Replay[]>([]);
	const messagesBufferToPlay = useRef<Replay[]>([]);
	const removeFromBuffer = useRef<String[]>([]);
	const [messagesBufferToPlayState, setMessagesBufferToPlayState] = useState<
		Replay[]
	>([]);
	const [time, setTime] = useState(
		new Date(new Date().getTime() - 60 * 60 * 1000)
	);
	const [fetchResult, setFetchResult] = useState(true);
	const replayElementRef = useRef<HTMLDivElement>(null);
	const playIntervalRef = useRef<NodeJS.Timeout>();

	function fetchAndStartPlay() {
		try {
			fetchMasterRecord(setMasterRecord, time, setFetchResult);
		} catch (e) {
			console.log(e);
		}
	}

	function resetPlayer() {
		messagesBufferToPlay.current = [];
		removeFromBuffer.current = [];
		setMessagesBufferToPlayState([...messagesBufferToPlay.current]);
		clearInterval(playIntervalRef.current);
	}

	function deletePlayedMessages() {
		messagesBufferToPlay.current = messagesBufferToPlay.current.filter(
			(replay) => {
				return !removeFromBuffer.current.includes(
					replay.message_text + replay.time
				);
			}
		);
	}

	function addMessagesToMainLoop(index: number) {
		messagesBufferToPlay.current.push(masterRecord[index]);
		setMessagesBufferToPlayState([...messagesBufferToPlay.current]);
	}

	useEffect(() => {
		if (!masterRecord.length) return;
		if (playIntervalRef.current) clearInterval(playIntervalRef.current);
		resetPlayer();
		let index = 0;
		let startingTime = new Date().getTime();
		playIntervalRef.current = setInterval(() => {
			const now = new Date().getTime();
			const timeDiff = now - startingTime;
			deletePlayedMessages();
			if (
				index + 1 <= masterRecord.length &&
				timeDiff > masterRecord[index].time
			) {
				addMessagesToMainLoop(index);
				startingTime = now;
				index++;
			}
			if (index >= masterRecord.length) {
				setTimeout(resetPlayer, 15000);
			}
		}, 200);
		return () => {
			resetPlayer();
		};
	}, [masterRecord]);
	return (
		<div className="relative grid h-full w-full gap-4">
			<div
				ref={replayElementRef}
				id="replay"
				className="relative grid h-full w-full overflow-hidden"
			>
				{messagesBufferToPlayState.map((replay) => (
					<Message
						key={replay.message_text + replay.time}
						replayElementRef={replayElementRef}
						message={replay}
						deleteReplay={removeFromBuffer}
					/>
				))}
			</div>
			<Settings
				time={time}
				fetchResult={fetchResult}
				isPlaying={!!messagesBufferToPlayState.length}
				setTime={setTime}
				fetchAndStartPlay={fetchAndStartPlay}
			/>
			<div
				className={`absolute right-0 top-0 mr-5 h-4 w-4 animate-pulse rounded-full bg-red-500 ${!messagesBufferToPlayState.length && 'hidden'}`}
			></div>
		</div>
	);
}

function Message({
	replayElementRef,
	message,
	deleteReplay
}: {
	replayElementRef: RefObject<HTMLDivElement>;
	message: Replay;
	deleteReplay: MutableRefObject<String[]>;
}) {
	const childElementref = useRef<HTMLDivElement>(null);
	const parentWidth = replayElementRef.current?.clientWidth || 0;
	const parentHeight = replayElementRef.current?.clientHeight || 0;
	const [childPosition, setChildPosition] = useState({
		top: Math.floor(Math.random() * parentHeight - 100) + 'px',
		left: Math.floor(Math.random() * parentWidth - 100) + 'px'
	});

	function randomizePosition() {
		setChildPosition({
			top: Math.floor(Math.random() * parentHeight - 100) + 'px',
			left: Math.floor(Math.random() * parentWidth - 100) + 'px'
		});
	}

	useEffect(() => {
		setTimeout(() => {
			let messageReady = true;
			if (!childElementref.current) return;
			if (!replayElementRef.current) return;
			if (
				checkOverflowFromParent(
					replayElementRef.current,
					childElementref.current
				)
			) {
				randomizePosition();
				messageReady = false;
			}
			const allOtherMessages: HTMLDivElement[] =
				replayElementRef.current.querySelectorAll(
					'.venter'
				) as unknown as HTMLDivElement[];
			allOtherMessages.forEach((el) => {
				if (!childElementref.current) return;
				if (el.id === `id-${message.message_text + message.time}`) return;
				if (checkOverlapBetweenMessages(childElementref.current, el)) {
					randomizePosition();
					messageReady = false;
				}
			});
			if (messageReady) {
				childElementref.current.style.animation = 'venter 10s linear forwards';
				setTimeout(() => {
					deleteReplay.current.push(message.message_text + message.time);
				}, 10000);
			}
		}, 100);
	}, [childPosition.top, childPosition.left]);

	return (
		<div
			ref={childElementref}
			style={{
				color: message.color_name,
				top: childPosition.top,
				left: childPosition.left,
				fontSize: 20 / message.message_text.length + 25 + 'px'
			}}
			className="venter absolute max-w-96 p-5 font-bold opacity-0"
			id={`id-${message.message_text + message.time}`}
		>
			{message.message_text}
		</div>
	);
}

async function fetchMasterRecord(
	setReplay: Dispatch<SetStateAction<Replay[]>>,
	time: Date,
	setFetchResult: Dispatch<SetStateAction<boolean>>
) {
	try {
		setFetchResult(true);
		const res = await fetch('/api/replay?time=' + time.toISOString());
		if (!res.ok) {
			throw new Error('Failed to fetch data');
		}
		const data = (await res.json()) as Replay[];
		setReplay(data);
		if (data.length > 0) {
			setFetchResult(true);
		} else {
			setFetchResult(false);
		}
	} catch (error) {
		console.log(error);
		throw new Error('Error');
	}
}

function checkOverflowFromParent(
	parent: HTMLDivElement,
	child: HTMLDivElement
) {
	const parentRect = parent.getBoundingClientRect();
	const childRect = child.getBoundingClientRect();
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

function Settings({
	setTime,
	fetchAndStartPlay,
	isPlaying,
	fetchResult,
	time
}: {
	setTime: Dispatch<SetStateAction<Date>>;
	fetchAndStartPlay: () => void;
	isPlaying: boolean;
	fetchResult: boolean;
	time: Date;
}) {
	const [showSettings, setShowSettings] = useState(false);
	useEffect(() => {
		setShowSettings(true);
	}, []);
	return (
		<>
			{!fetchResult && (
				<p className="fixed left-1/2 top-[80%] w-full translate-x-[-50%] p-4 text-center text-rose-900">
					No messages within the timeframe. Please select a different time.
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
						className="venter fixed left-1/2 top-[92%] translate-x-[-50%] text-center"
						variant={'outline'}
					>
						Settings
					</Button>
				</PopoverTrigger>
				<PopoverContent asChild>
					<div className="grid w-full gap-5">
						<DateTimePicker setTime={setTime} time={time} />
						<Button
							variant={'outline'}
							className="mx-auto w-28"
							onClick={() => {
								setShowSettings(!showSettings);
								fetchAndStartPlay();
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

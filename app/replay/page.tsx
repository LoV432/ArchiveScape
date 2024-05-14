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
	const [replay, setReplay] = useState<Replay[]>([]);
	const playReplay = useRef<Replay[]>([]);
	const deleteReplay = useRef<String[]>([]);
	const [playReplayState, setPlayReplayState] = useState<Replay[]>([]);
	const replayElementRef = useRef<HTMLDivElement>(null);
	const playIntervalRef = useRef<NodeJS.Timeout>();
	const [time, setTime] = useState(new Date('2024-05-10T05:10:25Z'));
	const [startFetch, setStartFetch] = useState(false);
	const [firstTime, setFirstTime] = useState(true);
	useEffect(() => {
		if (firstTime) {
			setFirstTime(false);
			return;
		}
		try {
			getSetReplay(setReplay, time);
		} catch (e) {
			console.log(e);
		}
	}, [startFetch]);
	useEffect(() => {
		if (!replay.length) return;
		if (playIntervalRef.current) clearInterval(playIntervalRef.current);
		playReplay.current = [];
		deleteReplay.current = [];
		setPlayReplayState([...playReplay.current]);
		let index = 0;
		let startingTime = new Date().getTime();
		playIntervalRef.current = setInterval(() => {
			const now = new Date().getTime();
			const timeDiff = now - startingTime;
			playReplay.current = playReplay.current.filter((replay) => {
				return !deleteReplay.current.includes(
					replay.message_text + replay.time
				);
			});
			if (index + 1 <= replay.length && timeDiff > replay[index].time) {
				playReplay.current.push(replay[index]);
				setPlayReplayState([...playReplay.current]);
				startingTime = now;
				index++;
			}
			if (index >= replay.length) {
				setTimeout(() => {
					playReplay.current = [];
					deleteReplay.current = [];
					setPlayReplayState([...playReplay.current]);
					clearInterval(playIntervalRef.current);
				}, 15000);
			}
		}, 200);
		return () => {
			clearInterval(playIntervalRef.current);
		};
	}, [replay]);
	return (
		<div className="relative grid h-full w-full gap-4">
			<div
				ref={replayElementRef}
				id="replay"
				className="relative grid h-full w-full overflow-hidden"
			>
				{playReplayState.map((replay) => (
					<Message
						key={replay.message_text + replay.time}
						replayElementRef={replayElementRef}
						message={replay}
						deleteReplay={deleteReplay}
					/>
				))}
			</div>
			<Settings
				isPlaying={!!playReplayState.length}
				setTime={setTime}
				startFetch={startFetch}
				setStartFetch={setStartFetch}
			/>
			<div
				className={`absolute right-0 top-0 mr-5 h-4 w-4 animate-pulse rounded-full bg-red-500 ${!playReplayState.length && 'hidden'}`}
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

async function getSetReplay(
	setReplay: Dispatch<SetStateAction<Replay[]>>,
	time: Date
) {
	try {
		const res = await fetch('/api/replay?time=' + time.toISOString());
		if (!res.ok) {
			throw new Error('Failed to fetch data');
		}
		const data = (await res.json()) as Replay[];
		setReplay(data);
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
	startFetch,
	setStartFetch,
	isPlaying
}: {
	setTime: Dispatch<SetStateAction<Date>>;
	startFetch: boolean;
	setStartFetch: Dispatch<SetStateAction<boolean>>;
	isPlaying: boolean;
}) {
	const [showSettings, setShowSettings] = useState(false);
	useEffect(() => {
		setShowSettings(true);
	}, []);
	return (
		<Popover
			onOpenChange={() => setShowSettings(!showSettings)}
			open={showSettings}
		>
			<PopoverTrigger asChild>
				<Button
					onClick={() => setShowSettings(!showSettings)}
					className="absolute left-1/2 top-[92%] translate-x-[-50%] text-center"
					variant={'outline'}
				>
					Settings
				</Button>
			</PopoverTrigger>
			<PopoverContent asChild>
				<div className="grid w-full gap-5">
					<DateTimePicker setTime={setTime} />
					<Button
						variant={'outline'}
						className="mx-auto w-28"
						onClick={() => setStartFetch(!startFetch)}
					>
						{isPlaying ? 'Restart' : 'Start'}
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}

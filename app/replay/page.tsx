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

export default function ReplayPage() {
	const [replay, setReplay] = useState<Replay[]>([]);
	const playReplay = useRef<Replay[]>([]);
	const deleteReplay = useRef<String[]>([]);
	const [playReplayState, setPlayReplayState] = useState<Replay[]>([]);
	const replayElementRef = useRef<HTMLDivElement>(null);
	const playIntervalRef = useRef<NodeJS.Timeout>();
	useEffect(() => {
		try {
			getSetReplay(setReplay);
		} catch (e) {
			console.log(e);
		}
	}, []);
	useEffect(() => {
		if (!replay.length) return;
		if (playIntervalRef.current) clearInterval(playIntervalRef.current);
		let index = 0;
		let startingTime = new Date().getTime();
		playIntervalRef.current = setInterval(() => {
			const now = new Date().getTime();
			const timeDiff = now - startingTime;
			if (index < replay.length && timeDiff > replay[index].time) {
				playReplay.current = playReplay.current.filter((replay) => {
					return !deleteReplay.current.includes(
						replay.message_text + replay.time
					);
				});
				playReplay.current.push(replay[index]);
				setPlayReplayState([...playReplay.current]);
				startingTime = now;
				index++;
			}
		}, 200);
		if (index >= replay.length) {
			clearInterval(playIntervalRef.current);
		}
		return () => {
			clearInterval(playIntervalRef.current);
		};
	}, [replay]);
	return (
		<div
			ref={replayElementRef}
			id="replay"
			className="relative grid h-full w-full overflow-hidden border"
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

async function getSetReplay(setReplay: Dispatch<SetStateAction<Replay[]>>) {
	try {
		const res = await fetch('/api/replay');
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
	return childRect.right > parentRect.right || childRect.left < parentRect.left;
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

'use client';

import {
	MutableRefObject,
	RefObject,
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
	useEffect(() => {
		(async () => {
			try {
				const req = await fetch('/api/replay?time=2024-05-10T05:10:25Z');
				const res = await req.json();
				setReplay(res);
			} catch (e) {
				console.log(e);
			}
		})();
	}, []);
	useEffect(() => {
		if (!replay.length) return;
		let index = 0;
		let startingTime = new Date().getTime();
		const interval = setInterval(() => {
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
			clearInterval(interval);
		}
		return () => {
			clearInterval(interval);
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

	useEffect(() => {
		setTimeout(() => {
			let messageReady = true;
			if (!childElementref.current) return;
			if (!replayElementRef.current) return;
			const childRect = childElementref.current.getBoundingClientRect();
			const parentRect = replayElementRef.current.getBoundingClientRect();
			if (
				childRect.top < parentRect.top ||
				childRect.left < parentRect.left ||
				childRect.bottom > parentRect.bottom ||
				childRect.right > parentRect.right
			) {
				setChildPosition({
					top: Math.floor(Math.random() * parentHeight - 100) + 'px',
					left: Math.floor(Math.random() * parentWidth - 100) + 'px'
				});
				messageReady = false;
			}
			const allOtherMessages =
				replayElementRef.current.querySelectorAll('.venter');
			allOtherMessages.forEach((el) => {
				if (el.id === `id-${message.message_text + message.time}`) return;
				const rect = el.getBoundingClientRect();
				if (
					!(
						childRect.right < rect.left ||
						childRect.left > rect.right ||
						childRect.bottom < rect.top ||
						childRect.top > rect.bottom
					)
				) {
					setChildPosition({
						top: Math.floor(Math.random() * parentHeight - 100) + 'px',
						left: Math.floor(Math.random() * parentWidth - 100) + 'px'
					});
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

import { Replay } from '../api/replay/route';

// TODO: This kinda sorta works but that's about it. I will get back to it one day. (I promise)

class MessagesPlayer {
	messages: Replay[];
	messagesInBuffer: Replay[];
	messagesRendered: Number[];
	playInterval: NodeJS.Timeout | null;
	setMessagesInBuffer: React.Dispatch<React.SetStateAction<Replay[]>>;
	time: Date;
	constructor(
		messages: Replay[],
		messagesInBuffer: Replay[] = [],
		setMessagesInBuffer: React.Dispatch<React.SetStateAction<Replay[]>>
	) {
		this.messages = messages;
		this.setMessagesInBuffer = setMessagesInBuffer;
		this.messagesInBuffer = messagesInBuffer;
		this.messagesRendered = [];
		this.playInterval = null;
		this.time = new Date();
	}

	async fetchMessages(time: Date) {
		try {
			this.cleanUp();
			const res = await fetch(`/api/replay?time=${time.toISOString()}`);
			if (!res.ok) {
				return {
					success: false as const,
					error: 'Something went wrong'
				};
			}
			const data = await res.json();
			if (data.length === 0) {
				return {
					success: false as const,
					error: 'No messages found'
				};
			}
			this.messages = data;
			return {
				success: true as const,
				error: null
			};
		} catch (e) {
			console.error(e);
			return {
				success: false as const,
				error: 'Something went wrong'
			};
		}
	}

	play() {
		let totalMessages = this.messages.length;
		if (totalMessages === 0) return;
		let startTime = new Date().getTime();
		let index = 0;
		this.playInterval = setInterval(() => {
			this.setMessagesInBuffer([...this.messagesInBuffer]); // To make sure removed messages are not in the buffer
			if (!this.messagesRendered.includes(index - 1) && index > 0) return;
			const now = new Date().getTime();
			const timeDiff = now - startTime;
			if (index === 0) {
				this.messagesInBuffer.push(this.messages[0]);
				this.setMessagesInBuffer([...this.messagesInBuffer]);
				startTime = now;
				index++;
				return;
			}
			if (timeDiff > this.messages[index].time) {
				this.messagesInBuffer.push(this.messages[index]);
				this.setMessagesInBuffer([...this.messagesInBuffer]);
				startTime = now;
				index++;
				return;
			}
			if (index + 1 >= this.messages.length) {
				if (this.playInterval) {
					clearInterval(this.playInterval);
					this.playInterval = null;
				}
				setTimeout(() => {
					this.cleanUp();
				}, 15000);
			}
			return;
		}, 100);
	}

	isPlaying() {
		return this.playInterval !== null;
	}

	messageRendered(message: Replay) {
		if (this.messagesRendered.includes(message.index)) return;
		this.messagesRendered.push(message.index);
	}

	removeMessageFromBuffer(message: Replay) {
		this.messagesInBuffer = this.messagesInBuffer.filter(
			(m) => m.index !== message.index
		);
	}

	cleanUp() {
		if (this.playInterval) {
			clearInterval(this.playInterval);
			this.playInterval = null;
		}
		this.playInterval = null;
		this.messagesInBuffer = [];
		this.messagesRendered = [];
		this.setMessagesInBuffer([]);
	}
}

export default MessagesPlayer;

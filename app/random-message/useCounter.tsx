import { useEffect, useState } from 'react';

export default function useCounter(initialCount: number) {
	const [count, setCount] = useState(initialCount);

	useEffect(() => {
		const interval = setInterval(() => {
			setCount((prevCount) => {
				if (prevCount <= 0) {
					return 0;
				}
				return prevCount - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	return { count, setCount, countEnded: count <= 0 };
}

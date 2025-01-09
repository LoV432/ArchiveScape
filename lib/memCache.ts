class MemCache {
	private cache: Record<
		string,
		{
			data: string;
			maxAge: number;
		}
	> = {};

	private isDev = process.env.NODE_ENV === 'development';

	async get<T>(key: string, ttl: number, callback: () => Promise<T>) {
		const t0 = this.isDev ? performance.now() : 0;
		const findCache = this.cache[key];
		if (findCache && findCache.maxAge > Date.now()) {
			const data = JSON.parse(findCache.data) as T;
			this.isDev && console.log(performance.now() - t0, 'Cache hit', key);
			return data;
		}
		const newData = await callback();
		const data = JSON.stringify(newData);
		const maxAge = Date.now() + ttl;
		this.cache[key] = { data, maxAge };
		this.isDev && console.log(performance.now() - t0, 'Cache miss', key);
		return newData;
	}

	pruneCache() {
		this.cache = {};
	}

	clearKey(key: string) {
		delete this.cache[key];
	}
}

export const memCache = new MemCache();

export function min(minutes: number) {
	return 1000 * 60 * minutes;
}

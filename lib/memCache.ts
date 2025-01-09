class MemCache {
	private cache: Map<
		string,
		{
			data: unknown;
			maxAge: number;
		}
	> = new Map();

	private isDev = process.env.NODE_ENV === 'development';

	async get<T>(key: string, ttl: number, callback: () => Promise<T>) {
		const t0 = this.isDev ? performance.now() : 0;
		const findCache = this.cache.get(key);
		if (findCache && findCache.maxAge > Date.now()) {
			this.isDev && console.log(performance.now() - t0, 'Cache hit', key);
			return findCache.data as T;
		}
		const newData = await callback();
		const maxAge = Date.now() + ttl;
		this.cache.set(key, { data: newData, maxAge });
		this.isDev && console.log(performance.now() - t0, 'Cache miss', key);
		return newData;
	}

	pruneCache() {
		this.cache = new Map();
	}

	clearKey(key: string) {
		this.cache.delete(key);
	}
}

export const memCache = new MemCache();

export function min(minutes: number) {
	return 1000 * 60 * minutes;
}

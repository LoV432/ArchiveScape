import { getTopDomain } from '@/lib/top-domain';
import { use } from 'react';
import { memCache, min } from '@/lib/memCache';

async function getTopDomainWithCache() {
	return memCache.get('top-domain', min(5), getTopDomain);
}

export default function TopDomain() {
	const topDomain = use(getTopDomainWithCache());
	return topDomain.domain;
}

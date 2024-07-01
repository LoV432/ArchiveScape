import { getTopDomain } from '@/lib/top-domain';
import { use } from 'react';

export default function TopDomain() {
	const topDomain = use(getTopDomain());
	return topDomain.domain;
}

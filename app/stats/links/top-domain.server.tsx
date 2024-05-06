import { getTopDomain } from '@/lib/top-domain';

export default async function TopDomain() {
	const topDomain = await getTopDomain();
	return topDomain.domain;
}

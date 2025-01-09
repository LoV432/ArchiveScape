import Canvas from './Canvas';
import { wordCloudList } from '@/lib/word-cloud';
export const dynamic = 'force-dynamic';
import { Metadata } from 'next/types';
import { memCache, min } from '@/lib/memCache';

export const metadata: Metadata = {
	title: 'Word Cloud | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/'
};

async function wordCloudListWithCache() {
	return memCache.get('word-cloud-list', min(5), wordCloudList);
}

export default async function Page() {
	const words = await wordCloudListWithCache();
	return <Canvas words={words} />;
}

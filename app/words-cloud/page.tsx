import Canvas from './Canvas';
import { wordCloudList } from '@/lib/word-cloud';
export const dynamic = 'force-dynamic';
import { Metadata } from 'next/types';

export const metadata: Metadata = {
	title: 'Word Cloud | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/'
};

export default async function Page() {
	return <CanvasWithSuspense />;
}

async function CanvasWithSuspense() {
	const words = await wordCloudList();
	return <Canvas words={words} />;
}

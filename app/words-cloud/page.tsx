import Canvas from './Canvas';
import { wordCloudList } from '@/lib/word-cloud';
export const dynamic = 'force-dynamic';

export default async function Page() {
	const words = await wordCloudList();
	return <Canvas words={words} />;
}

import { getDailyUsage } from '@/lib/get-daily-usage';
import DailyUsageChart from './page.client';
export const dynamic = 'force-dynamic';
import { Metadata } from 'next/types';

export const metadata: Metadata = {
	title: 'Daily Usage | ArchiveScape',
	description: 'An archive of all messages sent on https://www.ventscape.life/'
};

export default async function Page() {
	const messagesCount = await getDailyUsage();
	return <DailyUsageChart chartData={messagesCount} />;
}

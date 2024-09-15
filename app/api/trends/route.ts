import { getTrendsData } from '@/app/stats/trends/trends-data';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	try {
		const words = request.nextUrl.searchParams.get('words');
		if (!words) {
			return NextResponse.json({ error: 'No words provided.' });
		}
		const data = await getTrendsData(words.split(','));
		return NextResponse.json({ data });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'Something went wrong.' });
	}
}

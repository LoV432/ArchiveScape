import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;
	const url = searchParams.get('url');
	if (!url) {
		return new Response('Missing url parameter', { status: 400 });
	}
	if (!url.startsWith('https://api.dicebear.com/')) {
		return new Response('Invalid url parameter', { status: 400 });
	}
	const parsedUrl = new URL(url);
	if (
		parsedUrl.hostname !== 'api.dicebear.com' ||
		parsedUrl.pathname !== '/9.x/adventurer/png'
	) {
		return new Response('Invalid url parameter', { status: 400 });
	}
	try {
		const imageRequest = await fetch(parsedUrl.toString());
		if (!imageRequest.ok) {
			return new Response('Failed to get image', { status: 400 });
		}
		const contentType = imageRequest.headers.get('Content-Type');
		if (!contentType || !contentType.startsWith('image/')) {
			return new Response('Failed to get image', { status: 400 });
		}
		const image = await imageRequest.blob();
		return new Response(image, {
			headers: {
				'Content-Type': contentType,
				'Cache-Control': 'public, max-age=31536000, immutable'
			}
		});
	} catch (error) {
		return new Response('Failed to get image', { status: 400 });
	}
}

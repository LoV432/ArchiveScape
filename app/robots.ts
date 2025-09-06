import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: 'bingbot',
				disallow: '/search'
			},
			{
				userAgent: 'BLEXBot',
				disallow: '/'
			},
			{
				userAgent: '*',
				allow: '/'
			}
		],
		sitemap: `https://${process.env.HOST_NAME}/sitemap.xml`
	};
}

import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: `https://${process.env.HOST_NAME}/`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1
		},
		{
			url: `https://${process.env.HOST_NAME}/users`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.5
		},
		{
			url: `https://${process.env.HOST_NAME}/all-messages`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.5
		},
		{
			url: `https://${process.env.HOST_NAME}/conversation-tracker`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.5
		},
		{
			url: `https://${process.env.HOST_NAME}/random-message`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.5
		},
		{
			url: `https://${process.env.HOST_NAME}/replay`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.5
		},
		{
			url: `https://${process.env.HOST_NAME}/stats/top-10-users`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.5
		},
		{
			url: `https://${process.env.HOST_NAME}/stats/words-cloud`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.5
		},
		{
			url: `https://${process.env.HOST_NAME}/stats/links`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.5
		},
		{
			url: `https://${process.env.HOST_NAME}/stats/emojis`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.5
		},
		{
			url: `https://${process.env.HOST_NAME}/stats/rickroll`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.5
		},
		{
			url: `https://${process.env.HOST_NAME}/stats/daily-usage`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.5
		}
	];
}

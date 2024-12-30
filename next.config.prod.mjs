/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'standalone',
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'api.dicebear.com'
			}
		]
	},
	experimental: {
		staleTimes: {
			dynamic: 30,
			static: 180
		}
	}
};

export default nextConfig;

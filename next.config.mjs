/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    i18n: {
        locales: ['en'],
        defaultLocale: 'en',
    },
    async rewrites() {
        return [
            {
                source: '/',
                destination: '/index',
            },
        ];
    },
    experimental: {
        scrollRestoration: true,
    },
};

export default nextConfig;

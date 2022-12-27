/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    i18n: {
        locales: ['en'],
        defaultLocale: 'en',
    },
    experimental: {
        scrollRestoration: true,
    },
};

export default nextConfig;

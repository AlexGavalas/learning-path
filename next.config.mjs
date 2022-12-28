/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    i18n: {
        locales: ['en'],
        defaultLocale: 'en',
        localeDetection: false,
    },
    experimental: {
        scrollRestoration: true,
    },
};

export default nextConfig;

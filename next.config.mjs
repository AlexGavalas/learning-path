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
        runtime: 'experimental-edge',
    },
};

export default nextConfig;

import { type Metadata } from 'next';

export const DESCRIPTION = 'Learn stuff about software development';
export const TITLE = 'Learning Path';
export const SITE_URL = 'https://learning-path.dev/';

export const staticMetadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    icons: [
        {
            rel: 'icon',
            url: '/favicons/favicon-32x32.png',
            sizes: 'any',
        },
        {
            rel: 'icon',
            url: '/favicons/favicon.svg',
            type: 'image/svg+xml',
        },
        {
            rel: 'apple-touch-icon',
            url: '/favicons/apple-touch-icon.png',
            sizes: '180x180',
        },
    ],
    manifest: '/manifest.json',
    description: DESCRIPTION,
    openGraph: {
        siteName: TITLE,
        title: TITLE,
        description: DESCRIPTION,
        url: SITE_URL,
        images: [{ url: '/images/spash.jpg' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: TITLE,
        description: DESCRIPTION,
        images: ['/images/spash.jpg'],
    },
    themeColor: '#121212',
    alternates: {
        canonical: 'https://learning-path.dev',
        types: {
            'application/opensearchdescription+xml': '/opensearch.xml',
        },
    },
};

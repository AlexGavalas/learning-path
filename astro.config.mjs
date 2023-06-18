import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/edge';
import { defineConfig } from 'astro/config';
import 'dotenv/config';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';

const isProd = import.meta.env.PROD;
const isLocalBuild = process.env.LOCAL === 'true';

// https://astro.build/config
export default defineConfig({
    integrations: [mdx(), sitemap(), react(), tailwind()],
    site: isProd ? 'https://learning-path.dev' : 'http://localhost:3000',
    markdown: {
        rehypePlugins: [
            [
                rehypeExternalLinks,
                {
                    target: '_blank',
                },
            ],
            rehypeSlug,
            [
                rehypeAutolinkHeadings,
                {
                    behavior: 'wrap',
                },
            ],
        ],
    },
    output: 'hybrid',
    adapter: isLocalBuild ? node({ mode: 'standalone' }) : vercel(),
});

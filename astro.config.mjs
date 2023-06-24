import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/edge';
import { defineConfig } from 'astro/config';
import 'dotenv/config';

import { REHYPE_PLUGINS } from './src/config/markdown';

const isProd = process.env.PROD === 'true';
const isLocalBuild = process.env.LOCAL === 'true';

// https://astro.build/config
export default defineConfig({
    integrations: [mdx(), sitemap(), react(), tailwind()],
    site: isProd ? 'https://learning-path.dev' : 'http://localhost:3000',
    markdown: {
        rehypePlugins: REHYPE_PLUGINS,
    },
    output: 'hybrid',
    adapter: isLocalBuild ? node({ mode: 'standalone' }) : vercel(),
});

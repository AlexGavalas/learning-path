import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig } from 'astro/config';
import 'dotenv/config';

import { REHYPE_PLUGINS } from './src/config/markdown';

const isProd = process.env.PROD === 'true';

// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [vanillaExtractPlugin()],
    },
    integrations: [mdx(), sitemap()],
    site: isProd ? 'https://learning-path.dev' : 'http://localhost:4321',
    markdown: {
        rehypePlugins: REHYPE_PLUGINS,
        syntaxHighlight: 'shiki',
        shikiConfig: {
            theme: 'monokai',
        },
    },
    output: 'server',
    prefetch: true,
    scopedStyleStrategy: 'where',
    adapter: cloudflare({
        imageService: 'passthrough',
        platformProxy: {
            enabled: true,
        },
    }),
});

import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig } from 'astro/config';
import 'dotenv/config';

import { REHYPE_PLUGINS } from './src/config/markdown';

const isProd = process.env.PROD === 'true';
const isLocalBuild = process.env.LOCAL === 'true';

// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [vanillaExtractPlugin()],
    },
    devToolbar: {
        enabled: !isProd,
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
    adapter: isLocalBuild
        ? node({
              mode: 'standalone',
          })
        : vercel({
              functionPerRoute: true,
          }),
});

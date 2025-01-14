import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel/serverless';
import { defineConfig } from 'astro/config';
import 'dotenv/config';

import { REHYPE_PLUGINS } from './src/config/markdown';

const isProd = process.env.PROD === 'true';
const isLocalBuild = process.env.LOCAL === 'true';

// https://astro.build/config
export default defineConfig({
    devToolbar: {
        enabled: !isProd,
    },
    integrations: [mdx()],
    site: isProd ? 'https://learning-path.dev' : 'http://localhost:4321',
    markdown: {
        rehypePlugins: REHYPE_PLUGINS,
        syntaxHighlight: 'shiki',
        shikiConfig: {
            theme: 'monokai',
        },
    },
    experimental: {
        contentIntellisense: true,
    },
    output: 'server',
    prefetch: true,
    scopedStyleStrategy: 'where',
    adapter: isLocalBuild
        ? node({
              mode: 'standalone',
          })
        : vercel(),
});

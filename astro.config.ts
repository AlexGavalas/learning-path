import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel';
import { defineConfig, fontProviders } from 'astro/config';
import 'dotenv/config';

import { REHYPE_PLUGINS } from './src/config/markdown';

const isProd = process.env.PROD === 'true';
const isLocalBuild = process.env.LOCAL === 'true';

export default defineConfig({
    adapter: isLocalBuild
        ? node({
              mode: 'standalone',
          })
        : vercel(),
    devToolbar: {
        enabled: !isProd,
    },
    experimental: {
        contentIntellisense: true,
    },
    fonts: [
        {
            cssVariable: '--font-lexend',
            name: 'Lexend',
            provider: fontProviders.fontsource(),
        },
    ],
    integrations: [mdx()],
    markdown: {
        processor: unified({
            rehypePlugins: REHYPE_PLUGINS,
        }),
        shikiConfig: {
            theme: 'monokai',
        },
        syntaxHighlight: 'shiki',
    },
    output: 'server',
    prefetch: true,
    scopedStyleStrategy: 'where',
    site: isProd ? 'https://learning-path.dev' : 'http://localhost:4321',
});

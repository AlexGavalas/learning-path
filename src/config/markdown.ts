import type { Options } from 'react-markdown';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';

export const REHYPE_PLUGINS: Options['rehypePlugins'] = [
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
];

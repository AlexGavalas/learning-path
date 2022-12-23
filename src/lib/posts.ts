import fs from 'fs';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import path from 'path';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';

import { type NoteMDX } from '../../types/notes.types';

const POSTS_DIR = path.join(process.cwd(), 'posts');

export const getAllPostIds = () => {
    const fileNames = fs.readdirSync(POSTS_DIR);

    return fileNames.map((fileName) => {
        return {
            params: {
                id: fileName.replace(/\.mdx$/, ''),
            },
        };
    });
};

export const getPostData = async (filename: string): Promise<NoteMDX> => {
    const filePath = path.join(POSTS_DIR, `${filename}.mdx`);

    const fileContents = fs.readFileSync(filePath, 'utf8');

    const matterResult = matter(fileContents);

    const mdxSource = await serialize(matterResult.content, {
        mdxOptions: {
            rehypePlugins: [
                [rehypeExternalLinks, { target: '_blank' }],
                [rehypeSlug],
                [rehypeAutolinkHeadings, { behavior: 'wrap' }],
            ],
        },
    });

    // Can't type gray matter result yet
    return {
        mdxSource,
        ...matterResult.data,
        created: matterResult.data.date,
    } as NoteMDX;
};

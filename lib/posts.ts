import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { compareDesc, parseISO } from 'date-fns';
import { serialize } from 'next-mdx-remote/serialize';
import rehypeExternalLinks from 'rehype-external-links';

const POSTS_DIR = path.join(process.cwd(), 'posts');

export type Post = {
    id: string;
    date: string;
    updated: string;
    title: string;
    mdxSource: MDXRemoteSerializeResult<Record<string, unknown>>;
};

export const getSortedPosts = () => {
    const fileNames = fs.readdirSync(POSTS_DIR);

    // @ts-ignore
    // Can't type gray matter result yet
    const allPostsData: Post[] = fileNames.map((fileName) => {
        const id = fileName.replace(/\.mdx?$/, '');

        const filePath = path.join(POSTS_DIR, fileName);

        const fileContents = fs.readFileSync(filePath, 'utf8');

        const { data } = matter(fileContents);

        return { id, ...data };
    });

    return allPostsData.sort(({ date: a }, { date: b }) =>
        compareDesc(parseISO(a), parseISO(b))
    );
};

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

export const getPostData = async (id: string): Promise<Post> => {
    const filePath = path.join(POSTS_DIR, `${id}.mdx`);

    const fileContents = fs.readFileSync(filePath, 'utf8');

    const matterResult = matter(fileContents);

    const mdxSource = await serialize(matterResult.content, {
        mdxOptions: {
            // Types for `rehypeExternalLinks` provided with the `unified` package.
            rehypePlugins: [[rehypeExternalLinks, { target: '_blank' }]],
        },
    });

    // @ts-ignore
    // Can't type gray matter result yet
    return {
        id,
        mdxSource,
        ...matterResult.data,
    };
};

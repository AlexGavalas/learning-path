import { compareDesc, parseISO } from 'date-fns';
import fs from 'fs';
import matter from 'gray-matter';
import { type MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import path from 'path';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';

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

    // Can't type gray matter result yet
    const allPostsData = fileNames.map((fileName) => {
        const id = fileName.replace(/\.mdx?$/, '');

        const filePath = path.join(POSTS_DIR, fileName);

        const fileContents = fs.readFileSync(filePath, 'utf8');

        const { data } = matter(fileContents);

        return { id, ...data } as Post;
    });

    return allPostsData.sort(
        (a, b) =>
            compareDesc(parseISO(a.updated), parseISO(b.updated)) ||
            a.title.localeCompare(b.title),
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
            rehypePlugins: [
                [rehypeExternalLinks, { target: '_blank' }],
                [rehypeSlug],
                [rehypeAutolinkHeadings, { behavior: 'wrap' }],
            ],
        },
    });

    // Can't type gray matter result yet
    return {
        id,
        mdxSource,
        ...matterResult.data,
    } as Post;
};

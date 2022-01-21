import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeStringify from 'rehype-stringify';

const postsDirectory = path.join(process.cwd(), 'posts');

export type Post = {
    id: string;
    date: string;
    updated: string;
    title: string;
    contentHtml: string;
};

export const getSortedPostsData = () => {
    const fileNames = fs.readdirSync(postsDirectory);

    // @ts-ignore
    // Can't type gray matter result yet
    const allPostsData: Post[] = fileNames.map((fileName) => {
        const id = fileName.replace(/\.md$/, '');

        const fullPath = path.join(postsDirectory, fileName);

        const fileContents = fs.readFileSync(fullPath, 'utf8');

        const { data } = matter(fileContents);

        return { id, ...data };
    });

    return allPostsData.sort(({ date: a }, { date: b }) => {
        if (a < b) return 1;
        if (a > b) return -1;
        return 0;
    });
};

export const getAllPostIds = () => {
    const fileNames = fs.readdirSync(postsDirectory);

    return fileNames.map((fileName) => {
        return {
            params: {
                id: fileName.replace(/\.md$/, ''),
            },
        };
    });
};

export const getPostData = async (id: string): Promise<Post> => {
    const fullPath = path.join(postsDirectory, `${id}.md`);

    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContents);

    const processedContent = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeExternalLinks, { target: '_blank' })
        .use(rehypeStringify)
        .process(matterResult.content);

    const contentHtml = processedContent.toString();

    // @ts-ignore
    // Can't type gray matter result yet
    return {
        id,
        contentHtml,
        ...matterResult.data,
    };
};

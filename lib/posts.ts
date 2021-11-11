import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

export type Post = {
	id: string;
	date: string;
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

	const processedContent = await remark()
		.use(html)
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

import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';

import { supabase } from '~lib/supabase';
import { type NoteMDX } from '~types/notes.types';

export const getAllNoteIds = async () => {
    const { data: fileNames, error } = await supabase.storage
        .from('notes_test_1')
        .list();

    if (error) {
        throw error;
    }

    return fileNames.map((file) => {
        return {
            params: {
                id: file.name.replace(/\.mdx$/, ''),
            },
        };
    });
};

export const getNoteData = async (filename: string): Promise<NoteMDX> => {
    const filePath = `${filename}.mdx`;

    const { data: fileContents, error } = await supabase.storage
        .from('notes_test_1')
        .download(filePath);

    if (error) {
        throw error;
    }

    const matterResult = matter(await fileContents.text());

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
    } as NoteMDX;
};

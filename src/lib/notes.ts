import { supabase } from '~lib/supabase';

export const getAllNoteIds = async () => {
    const { data: fileNames, error } = await supabase.storage
        .from('notes_md_files')
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

export const getNoteData = async (filename: string) => {
    const filePath = `${filename}.mdx`;

    const { data: fileContents, error } = await supabase.storage
        .from('notes_md_files')
        .download(filePath);

    if (error) {
        throw error;
    }

    return await fileContents.text();
};

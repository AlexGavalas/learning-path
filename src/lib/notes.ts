import { supabase } from '~lib/supabase';

export const getAllNoteIds = async () => {
    const { data: fileNames, error } = await supabase.storage
        .from('notes_md_files')
        .list();

    if (error) {
        console.error(error);

        return null;
    }

    return fileNames.map((file) => ({
        id: file.name.replace(/\.mdx$/, ''),
    }));
};

export const getNoteData = async (filename: string) => {
    const filePath = `${filename}.mdx`;

    const { data: fileContents, error } = await supabase.storage
        .from('notes_md_files')
        .download(filePath);

    if (error) {
        console.error(error);

        return null;
    }

    return await fileContents.text();
};

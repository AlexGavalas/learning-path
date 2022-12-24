import { format } from 'date-fns';
import { type FormEventHandler, useState } from 'react';

import { Button } from '~components/button';
import { Dialog } from '~components/dialog';
import { Textarea } from '~components/textarea';

import { type UserPost } from '../../../types/notes.types';

interface ListItemProps {
    post: UserPost;
    isMine: boolean;
    onPostDelete: (id: string) => void;
    onPostUpdate: (id: string, newPost: string) => Promise<void>;
}

export const ListItem = ({
    post,
    isMine,
    onPostDelete,
    onPostUpdate,
}: ListItemProps) => {
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const { post: postData, name, id, created_at } = post;

    const postDate = format(new Date(created_at), 'dd/MM/yyyy HH:mm');

    const closeDialog = () => setOpenEditDialog(false);

    const updatePost: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        const newPost = new FormData(e.currentTarget)
            .get('newpost')
            ?.toString();

        if (!newPost) return;

        await onPostUpdate(post.id, newPost);

        closeDialog();
    };

    return (
        <li className="flex list-none flex-col border-0 border-solid py-6 last:border-b-0">
            <p className="break-words border-0 border-l-2 border-solid border-l-teal-500 pl-4 dark:border-l-yellow-500">
                {postData}
            </p>
            <div className="flex items-center gap-4 self-end">
                {isMine && (
                    <div className="flex h-5 gap-2">
                        <Button
                            variant="danger"
                            onClick={() => onPostDelete(id)}
                        >
                            Delete
                        </Button>
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpenEditDialog(true);
                            }}
                        >
                            Edit
                        </Button>
                    </div>
                )}
                <p className="text-sm italic ">
                    - {name} at {postDate}
                </p>
            </div>
            <Dialog
                open={openEditDialog}
                size="md"
                onClickOutside={closeDialog}
            >
                <form onSubmit={updatePost} className="flex flex-col gap-2">
                    <Textarea
                        label="Make your changes"
                        name="newpost"
                        defaultValue={post.post}
                    />
                    <div className="flex justify-end gap-2">
                        <Button
                            onClick={closeDialog}
                            type="button"
                            variant="danger"
                        >
                            Cancel
                        </Button>
                        <Button>Save</Button>
                    </div>
                </form>
            </Dialog>
        </li>
    );
};

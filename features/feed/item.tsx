import { useState, FormEventHandler } from 'react';
import { format } from 'date-fns';

import { Dialog } from '~components/dialog';
import { Button } from '~components/button';
import { Textarea } from '~components/textarea';

interface ListItemProps {
    post: UserPost;
    isMine: boolean;
    handleDelete: (id: string) => void;
    onPostUpdate: (id: string, newPost: string) => Promise<void>;
}

export const ListItem = ({
    post,
    isMine,
    handleDelete,
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
        <li className="list-none py-6 border-0 border-solid last:border-b-0 flex flex-col">
            <p className="border-solid border-0 border-l-2 border-l-teal-500 dark:border-l-yellow-500 pl-4 break-words">
                {postData}
            </p>
            <div className="self-end flex gap-4 items-center">
                {isMine && (
                    <div className="flex gap-2 h-5">
                        <Button
                            variant="danger"
                            onClick={() => handleDelete(id)}
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
                <p className="italic text-sm ">
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
                    <div className="flex gap-2 justify-end">
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

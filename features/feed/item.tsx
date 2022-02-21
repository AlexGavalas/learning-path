import { useState, FormEventHandler } from 'react';
import { format } from 'date-fns';
import { query as q } from 'faunadb';

import { fauna } from '../../lib/fauna';
import { Dialog } from '../../components/dialog';
import { Button } from '../../components/button';
import { Textarea } from '../../components/textarea';

interface ListItemProps {
    post: Post;
    isMine: boolean;
    handleDelete: (id: string) => void;
    onPostUpdate: (id: string, newPost: string) => void;
}

export const ListItem = ({
    post,
    isMine,
    handleDelete,
    onPostUpdate,
}: ListItemProps) => {
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const { post: postData, name, id, ts: timestamp } = post;

    const postDate = format(new Date(timestamp), 'dd/MM/yyyy HH:mm');

    const closeDialog = () => setOpenEditDialog(false);

    const updatePost: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        const newPost = new FormData(e.currentTarget)
            .get('newpost')
            ?.toString();

        if (!newPost) return;

        await fauna.query(
            q.Update(q.Ref(q.Collection('posts'), post.id), {
                data: {
                    post: newPost,
                },
            })
        );

        onPostUpdate(post.id, newPost);

        closeDialog();
    };

    return (
        <li className="list-none py-6 border-0 border-solid last:border-b-0 flex flex-col">
            <p className="border-solid border-0 border-l-2 border-l-[#4675aa] pl-4 break-words">
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
                        <Button onClick={() => setOpenEditDialog(true)}>
                            Edit
                        </Button>
                    </div>
                )}
                <p className="italic text-sm ">
                    - {name} at {postDate}
                </p>
            </div>
            <Dialog open={openEditDialog} size="md">
                <p className="m-0 mb-2">Make your changes</p>
                <form onSubmit={updatePost}>
                    <Textarea name="newpost" defaultValue={post.post} />
                    <div className="flex gap-2 justify-end">
                        <Button onClick={closeDialog} variant="danger">
                            Cancel
                        </Button>
                        <Button>Save</Button>
                    </div>
                </form>
            </Dialog>
        </li>
    );
};

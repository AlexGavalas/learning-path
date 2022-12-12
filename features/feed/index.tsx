import { useState, useRef, useCallback } from 'react';

import { useUser } from '@lib/use-user';
import { Dialog } from '@components/dialog';
import { Button } from '@components/button';
import { ListItem } from './item';

interface FeedProps {
    posts: Post[];
    onPostDelete: (id: string) => Promise<void>;
    onPostUpdate: (id: string, newPost: string) => Promise<void>;
}

export const Feed = ({ posts, onPostDelete, onPostUpdate }: FeedProps) => {
    const [openDialog, setOpenDialog] = useState(false);
    const idToDelete = useRef<string>();
    const { user } = useUser();

    const closeDialog = useCallback(() => setOpenDialog(false), []);

    const handleDelete = (id: string) => {
        idToDelete.current = id;
        setOpenDialog(true);
    };

    const deleteCurrentId = async () => {
        const id = idToDelete.current;

        if (!id) return;

        await onPostDelete(id);
    };

    if (!posts.length) {
        return <p className="text-center">No posts yet</p>;
    }

    return (
        <>
            <ul className="mt-4">
                {posts.map((post) => {
                    const isMine = post.name === user?.user_metadata.name;

                    return (
                        <ListItem
                            key={post.id}
                            post={post}
                            isMine={true}
                            handleDelete={handleDelete}
                            onPostUpdate={onPostUpdate}
                        />
                    );
                })}
            </ul>
            <Dialog open={openDialog} onClickOutside={closeDialog}>
                <p>Are you sure you want to delete?</p>
                <div className="flex gap-2 justify-end">
                    <Button onClick={closeDialog}>No</Button>
                    <Button
                        onClick={() => {
                            deleteCurrentId();
                            closeDialog();
                        }}
                    >
                        Yes
                    </Button>
                </div>
            </Dialog>
        </>
    );
};

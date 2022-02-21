import { useState, useRef, useCallback } from 'react';

import { redis } from '../../lib/redis';
import { useUser } from '../../lib/use-user';
import { Dialog } from '../../components/dialog';
import { Button } from '../../components/button';
import { ListItem } from './item';

interface FeedProps {
    posts: Post[];
    onPostDelete: (key: string) => void;
}

export const Feed = ({ posts, onPostDelete }: FeedProps) => {
    const [openDialog, setOpenDialog] = useState(false);
    const keyToDelete = useRef<string>();
    const { user } = useUser();

    const closeDialog = useCallback(() => setOpenDialog(false), []);

    const handleDelete = (key: string) => {
        setOpenDialog(true);
        keyToDelete.current = key;
    };

    const deleteCurrentKey = async () => {
        const key = keyToDelete.current;

        if (!key) return;

        const { error } = await redis.del(key);

        if (error) {
            // TODO: Show an error to the user
            return;
        }

        onPostDelete(key);
    };

    if (!posts.length) {
        return <p className="text-center">No posts yet</p>;
    }

    return (
        <>
            <ul className="mt-4">
                {posts.map((post) => {
                    const isMine = post.data.name === user?.user_metadata.name;

                    return (
                        <ListItem
                            key={post.key}
                            post={post}
                            isMine={isMine}
                            handleDelete={handleDelete}
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
                            deleteCurrentKey();
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

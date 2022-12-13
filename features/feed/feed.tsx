import { useState, useCallback } from 'react';

import { useUser } from '~lib/use-user';
import { Dialog } from '~components/dialog';
import { Button } from '~components/button';
import { ListItem } from './item';

interface FeedProps {
    posts: UserPost[];
    onPostDelete: (id: string) => Promise<void>;
    onPostUpdate: (id: string, newPost: string) => Promise<void>;
}

export const Feed = ({ posts, onPostDelete, onPostUpdate }: FeedProps) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [idToDelete, setIdToDelete] = useState('');
    const [error, setError] = useState<string>();
    const { user } = useUser();

    const closeDialog = useCallback(() => setOpenDialog(false), []);

    const handleDelete = (id: string) => {
        setIdToDelete(id);
        setOpenDialog(true);
    };

    const deleteCurrentId = async () => {
        try {
            await onPostDelete(idToDelete);

            closeDialog();
        } catch (e) {
            const errorMessage =
                e instanceof Error ? e.message : 'An unknown error occured';

            setError(errorMessage);
        }
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
                            isMine={isMine}
                            onPostDelete={handleDelete}
                            onPostUpdate={onPostUpdate}
                        />
                    );
                })}
            </ul>
            <Dialog open={openDialog} onClickOutside={closeDialog}>
                <p>Are you sure you want to delete?</p>
                {error && <span>{error}</span>}
                <div className="flex gap-2 justify-end">
                    <Button onClick={closeDialog}>No</Button>
                    <Button onClick={deleteCurrentId}>Yes</Button>
                </div>
            </Dialog>
        </>
    );
};

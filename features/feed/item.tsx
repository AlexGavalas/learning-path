import { format } from 'date-fns';

import { Button } from '../../components/button';

interface ListItemProps {
    post: Post;
    isMine: boolean;
    handleDelete: (key: string) => void;
}

export const ListItem = ({ post, isMine, handleDelete }: ListItemProps) => {
    const {
        data: { post: postData, name },
        key,
    } = post;

    const [, timestamp] = key.split(':');

    const postDate = format(new Date(+timestamp), 'dd/MM/yyyy HH:mm');

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
                            onClick={() => handleDelete(key)}
                        >
                            Delete
                        </Button>
                        {/* <Button
                            onClick={() => {
                                handleEdit(post);
                            }}
                        >
                            Edit
                        </Button> */}
                    </div>
                )}
                <p className="italic text-sm ">
                    - {name} at {postDate}
                </p>
            </div>
        </li>
    );
};

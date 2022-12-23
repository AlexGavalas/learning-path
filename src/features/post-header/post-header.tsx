import { FormattedDate } from '~components/formatted-date';

import { type NoteMDX } from '../../../types/notes.types';

type PostHeaderProps = {
    post: NoteMDX;
};

export const PostHeader = ({ post }: PostHeaderProps) => (
    <>
        <h1 className="my-8">{post.title}</h1>
        <div className="text-gray-500 flex gap-2 mb-4">
            <p>
                Created at <FormattedDate dateString={post.created} />
            </p>
            <p> / </p>
            <p>
                Updated at <FormattedDate dateString={post.updated} />
            </p>
        </div>
    </>
);

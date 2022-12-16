import { FormattedDate } from '~components/formatted-date';
import { Post } from '~lib/posts';

type PostHeaderProps = {
    post: Post;
};

export const PostHeader = ({ post }: PostHeaderProps) => (
    <>
        <h1 className="my-8">{post.title}</h1>
        <div className="text-gray-500 flex gap-2 mb-4">
            <p>
                Created at <FormattedDate dateString={post.date} />
            </p>
            <p> / </p>
            <p>
                Updated at <FormattedDate dateString={post.updated} />
            </p>
        </div>
    </>
);

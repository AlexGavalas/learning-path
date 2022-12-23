import Link from 'next/link';

import { FormattedDate } from '~components/formatted-date';
import { List, ListItem } from '~components/list';

import { type Note } from '../../../types/notes.types';

type PostsListProps = {
    posts: Note[];
    lines: Record<string, string[]>;
};

export const PostsList = ({ posts, lines }: PostsListProps) => {
    if (!posts.length) {
        return <p className="text-center">No notes found</p>;
    }

    return (
        <ul className="list-none p-0 divide-x-0 divide-y-2 divide-solid dark:divide-zinc-800 divide-zinc-300">
            {posts.map(({ filename, updated, title }) => (
                <li key={filename}>
                    <Link
                        href={`/posts/${filename}`}
                        className="hover:no-underline"
                        role="link"
                    >
                        <div className="group flex justify-between items-center cursor-pointer text-black dark:text-white dark:hover:bg-neutral-800 hover:bg-gray-100 p-2">
                            <div className="flex gap-2 flex-col-reverse sm:flex-row">
                                <FormattedDate
                                    dateString={updated}
                                    format="dd/MM/yy"
                                />
                                <span className="text-teal-500 dark:text-yellow-500 hover:no-underline">
                                    {title}
                                </span>
                            </div>
                            <span className="opacity-0 group-hover:animate-pulse">
                                &#x21dd;
                            </span>
                        </div>
                    </Link>
                    {lines[title] && (
                        <List>
                            {lines[title].map((line) => (
                                <ListItem key={line}>{line}</ListItem>
                            ))}
                        </List>
                    )}
                </li>
            ))}
        </ul>
    );
};

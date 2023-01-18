import Link from 'next/link';

import { FormattedDate } from '~components/formatted-date';
import { List, ListItem } from '~components/list';
import { type Note } from '~types/notes.types';

type NotesListProps = {
    notes: Note[];
    lines: Record<string, string[]>;
};

export const NotesList = ({ notes, lines }: NotesListProps) => {
    if (!notes.length) {
        return <p className="text-center">No notes found</p>;
    }

    return (
        <ul className="list-none divide-x-0 divide-y-2 divide-solid divide-zinc-300 p-0 dark:divide-zinc-800">
            {notes.map(({ filename, updated, title }) => (
                <li key={filename}>
                    <Link
                        href={`/notes/${filename}`}
                        className="hover:no-underline"
                        role="link"
                    >
                        <div className="group flex cursor-pointer items-center justify-between p-2 text-black hover:bg-gray-100 dark:text-white dark:hover:bg-neutral-800">
                            <div className="flex flex-col-reverse gap-2 sm:flex-row">
                                <FormattedDate
                                    dateString={updated}
                                    format="dd/MM/yy"
                                />
                                <span className="text-light-primary hover:no-underline dark:text-dark-primary">
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

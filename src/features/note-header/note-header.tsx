import { FormattedDate } from '~components/formatted-date';
import { type NoteMDX } from '~types/notes.types';

type NoteHeaderProps = {
    note: NoteMDX;
    timeZone: string;
};

export const NoteHeader = ({ note, timeZone }: NoteHeaderProps) => (
    <>
        <h1 className="my-8">{note.title}</h1>
        <div className="mb-4 flex gap-2 text-gray-500">
            <p>
                Created at{' '}
                <FormattedDate dateString={note.created} timeZone={timeZone} />
            </p>
            <p> / </p>
            <p>
                Updated at{' '}
                <FormattedDate dateString={note.updated} timeZone={timeZone} />
            </p>
        </div>
    </>
);

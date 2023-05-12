import { FormattedDate } from '~components/formatted-date';
import { type NoteMDX } from '~types/notes.types';

type NoteHeaderProps = {
    timeZone: string;
} & Pick<NoteMDX, 'title' | 'created' | 'updated'>;

export const NoteHeader = ({
    title,
    created,
    updated,
    timeZone,
}: NoteHeaderProps) => (
    <>
        <h1 className="my-8">{title}</h1>
        <div className="mb-4 flex gap-2 text-gray-500">
            <p>
                Created at{' '}
                <FormattedDate dateString={created} timeZone={timeZone} />
            </p>
            <p> / </p>
            <p>
                Updated at{' '}
                <FormattedDate dateString={updated} timeZone={timeZone} />
            </p>
        </div>
    </>
);

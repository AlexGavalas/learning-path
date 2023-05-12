import { axe } from 'jest-axe';

import { getTimeZone, renderWithUser } from '~test/helpers';
import { type NoteMDX } from '~types/notes.types';

import { NoteHeader } from './note-header';

const timeZone = getTimeZone();

describe('<NoteHeader />', () => {
    const note: NoteMDX = {
        created: '2022-01-01',
        id: 1,
        line: 'line',
        filename: 'filename',
        mdxSource: {
            scope: {},
            frontmatter: {},
            compiledSource: '',
        },
        title: 'title',
        updated: '2022-01-01',
    };

    it('renders', () => {
        const { container } = renderWithUser(
            <NoteHeader {...note} timeZone={timeZone} />,
        );

        expect(container).toMatchSnapshot();
    });

    it('is accessible', async () => {
        const { container } = renderWithUser(
            <NoteHeader {...note} timeZone={timeZone} />,
        );

        const a11yResults = await axe(container);

        expect(a11yResults).toHaveNoViolations();
    });
});

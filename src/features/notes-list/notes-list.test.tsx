import { axe } from 'jest-axe';
import { type ReactElement, cloneElement } from 'react';

import { getTimeZone, renderWithUser, screen } from '~test/helpers';
import { type Note } from '~types/notes.types';

import { NotesList } from './notes-list';

jest.mock(
    'next/link',
    () =>
        ({ children, ...rest }: { children: ReactElement }) =>
            cloneElement(children, { ...rest }),
);

const timeZone = getTimeZone();

describe('<NotesList />', () => {
    describe('when there are no notes', () => {
        const NO_NOTES: Note[] = [];
        const NO_LINES = {};

        it('renders', () => {
            const { container } = renderWithUser(
                <NotesList
                    notes={NO_NOTES}
                    lines={NO_LINES}
                    timeZone={timeZone}
                />,
            );

            expect(container).toMatchSnapshot();
        });

        it('is accessible', async () => {
            const { container } = renderWithUser(
                <NotesList
                    notes={NO_NOTES}
                    lines={NO_LINES}
                    timeZone={timeZone}
                />,
            );

            const a11yResults = await axe(container);

            expect(a11yResults).toHaveNoViolations();
        });
    });

    describe('when there are notes', () => {
        const NOTES: Note[] = [
            {
                created: '2022-01-01',
                id: 1,
                filename: 'filename',
                line: 'line',
                title: 'title',
                updated: '2022-01-01',
            },
        ];

        const NO_LINES = {};

        it('renders', () => {
            const { container } = renderWithUser(
                <NotesList
                    notes={NOTES}
                    lines={NO_LINES}
                    timeZone={timeZone}
                />,
            );

            expect(container).toMatchSnapshot();
        });

        it('is accessible', async () => {
            const { container } = renderWithUser(
                <NotesList
                    notes={NOTES}
                    lines={NO_LINES}
                    timeZone={timeZone}
                />,
            );

            const a11yResults = await axe(container);

            expect(a11yResults).toHaveNoViolations();
        });

        it('renders item in a link', () => {
            renderWithUser(
                <NotesList
                    notes={NOTES}
                    lines={NO_LINES}
                    timeZone={timeZone}
                />,
            );

            const link = screen.getByRole('link', {
                name: new RegExp(NOTES[0].title),
            });

            expect(link).toBeInTheDocument();
        });

        describe('when there are lines', () => {
            const LINES = {
                [NOTES[0].title]: ['line'],
            };

            it('renders', () => {
                const { container } = renderWithUser(
                    <NotesList
                        notes={NOTES}
                        lines={LINES}
                        timeZone={timeZone}
                    />,
                );

                expect(container).toMatchSnapshot();
            });

            it('is accessible', async () => {
                const { container } = renderWithUser(
                    <NotesList
                        notes={NOTES}
                        lines={LINES}
                        timeZone={timeZone}
                    />,
                );

                const a11yResults = await axe(container);

                expect(a11yResults).toHaveNoViolations();
            });
        });
    });
});

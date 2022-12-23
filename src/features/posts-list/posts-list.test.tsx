import { axe } from 'jest-axe';
import { type ReactElement, cloneElement } from 'react';

import { renderWithUser, screen } from '~test/helpers';

import { type Note } from '../../../types/notes.types';
import { PostsList } from './posts-list';

jest.mock(
    'next/link',
    () =>
        ({ children, ...rest }: { children: ReactElement }) =>
            cloneElement(children, { ...rest }),
);
describe('<PostsList />', () => {
    describe('when there are no posts', () => {
        const NO_POSTS: Note[] = [];
        const NO_LINES = {};

        it('renders', () => {
            const { container } = renderWithUser(
                <PostsList posts={NO_POSTS} lines={NO_LINES} />,
            );

            expect(container).toMatchSnapshot();
        });

        it('is accessible', async () => {
            const { container } = renderWithUser(
                <PostsList posts={NO_POSTS} lines={NO_LINES} />,
            );

            const a11yResults = await axe(container);

            expect(a11yResults).toHaveNoViolations();
        });
    });

    describe('when there are posts', () => {
        const POSTS: Note[] = [
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
                <PostsList posts={POSTS} lines={NO_LINES} />,
            );

            expect(container).toMatchSnapshot();
        });

        it('is accessible', async () => {
            const { container } = renderWithUser(
                <PostsList posts={POSTS} lines={NO_LINES} />,
            );

            const a11yResults = await axe(container);

            expect(a11yResults).toHaveNoViolations();
        });

        it('renders item in a link', () => {
            renderWithUser(<PostsList posts={POSTS} lines={NO_LINES} />);

            const link = screen.getByRole('link', {
                name: new RegExp(POSTS[0].title),
            });

            expect(link).toBeInTheDocument();
        });

        describe('when there are lines', () => {
            const LINES = {
                [POSTS[0].title]: ['line'],
            };

            it('renders', () => {
                const { container } = renderWithUser(
                    <PostsList posts={POSTS} lines={LINES} />,
                );

                expect(container).toMatchSnapshot();
            });

            it('is accessible', async () => {
                const { container } = renderWithUser(
                    <PostsList posts={POSTS} lines={LINES} />,
                );

                const a11yResults = await axe(container);

                expect(a11yResults).toHaveNoViolations();
            });
        });
    });
});

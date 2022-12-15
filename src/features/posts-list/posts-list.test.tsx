import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ReactElement, cloneElement } from 'react';

import { Post } from '~lib/posts';
import { PostsList } from './posts-list';

jest.mock(
    'next/link',
    () =>
        ({ children, ...rest }: { children: ReactElement }) =>
            cloneElement(children, { ...rest }),
);
describe('<PostsList />', () => {
    describe('when there are no posts', () => {
        const NO_POSTS: Post[] = [];
        const NO_LINES = {};

        it('renders', () => {
            const { container } = render(
                <PostsList posts={NO_POSTS} lines={NO_LINES} />,
            );

            expect(container).toMatchSnapshot();
        });

        it('is accessible', async () => {
            const { container } = render(
                <PostsList posts={NO_POSTS} lines={NO_LINES} />,
            );

            const a11yResults = await axe(container);

            expect(a11yResults).toHaveNoViolations();
        });
    });

    describe('when there are posts', () => {
        const POSTS: Post[] = [
            {
                date: '2022-01-01',
                id: '1',
                mdxSource: {
                    compiledSource: '',
                },
                title: 'title',
                updated: '2022-01-01',
            },
        ];

        const NO_LINES = {};

        it('renders', () => {
            const { container } = render(
                <PostsList posts={POSTS} lines={NO_LINES} />,
            );

            expect(container).toMatchSnapshot();
        });

        it('is accessible', async () => {
            const { container } = render(
                <PostsList posts={POSTS} lines={NO_LINES} />,
            );

            const a11yResults = await axe(container);

            expect(a11yResults).toHaveNoViolations();
        });

        it('renders item in a link', () => {
            render(<PostsList posts={POSTS} lines={NO_LINES} />);

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
                const { container } = render(
                    <PostsList posts={POSTS} lines={LINES} />,
                );

                expect(container).toMatchSnapshot();
            });

            it('is accessible', async () => {
                const { container } = render(
                    <PostsList posts={POSTS} lines={LINES} />,
                );

                const a11yResults = await axe(container);

                expect(a11yResults).toHaveNoViolations();
            });
        });
    });
});

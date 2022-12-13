import { ReactElement } from 'react';
import { render, RenderOptions, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { UserContextProvider } from '~lib/use-user';

import { Feed } from './feed';

jest.mock('~lib/supabase', () => ({
    supabase: {
        auth: {
            onAuthStateChange: jest.fn().mockReturnValue({
                data: {
                    subscription: {
                        unsubscribe: jest.fn(),
                    },
                },
            }),
            getSession: jest
                .fn()
                .mockResolvedValue({ data: { session: null } }),
        },
    },
}));

const setup = (ui: ReactElement, options?: RenderOptions) => ({
    user: userEvent.setup(),
    ...render(ui, options),
});

const POSTS: Post[] = [
    {
        id: '1',
        created_at: new Date('2022-01-01').toISOString(),
        name: 'name',
        post: 'post',
    },
];

describe('<Feed />', () => {
    const renderFeed = ({ posts }: { posts: Post[] }) => {
        const mockPostDelete = jest.fn();
        const mockPostUpdate = jest.fn();

        const renderResult = setup(
            <Feed
                posts={posts}
                onPostDelete={mockPostDelete}
                onPostUpdate={mockPostUpdate}
            />,
            { wrapper: UserContextProvider },
        );

        return {
            ...renderResult,
            mockPostDelete,
            mockPostUpdate,
        };
    };

    describe('when posts are empty', () => {
        it('renders', () => {
            const { container } = renderFeed({ posts: [] });

            expect(container).toMatchSnapshot();
        });

        it('is accessible', async () => {
            const { container } = renderFeed({ posts: [] });

            const a11yResults = await axe(container);

            expect(a11yResults).toHaveNoViolations();
        });
    });

    describe('when posts exist', () => {
        const { container } = renderFeed({ posts: POSTS });

        expect(container).toMatchSnapshot();
    });
});

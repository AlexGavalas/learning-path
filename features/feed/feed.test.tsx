import { ReactElement } from 'react';
import {
    render,
    RenderOptions,
    screen,
    act,
    waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';

import { UserContextProvider } from '~lib/use-user';
import { supabase } from '~lib/supabase';
import { Feed } from './feed';

jest.mock('~lib/supabase');

const setup = (ui: ReactElement, options?: RenderOptions) => ({
    user: userEvent.setup(),
    ...render(ui, options),
});

const POSTS: UserPost[] = [
    {
        id: '1',
        created_at: new Date('2022-01-01').toISOString(),
        name: 'name',
        post: 'post',
    },
];

type GetSessionResponse = Awaited<ReturnType<typeof supabase.auth.getSession>>;

const sessionWithUser: GetSessionResponse = {
    error: null,
    data: {
        session: {
            access_token: '',
            expires_in: 0,
            refresh_token: '',
            token_type: '',
            user: {
                app_metadata: {},
                aud: '',
                created_at: '',
                id: '1',
                user_metadata: {
                    name: 'name',
                },
            },
        },
    },
};

describe('<Feed />', () => {
    const renderFeed = ({ posts }: { posts: UserPost[] }) => {
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
        it('renders', () => {
            const { container } = renderFeed({ posts: POSTS });

            expect(container).toMatchSnapshot();
        });

        it('is accessible', async () => {
            const { container } = renderFeed({ posts: POSTS });

            const a11yResults = await axe(container);

            expect(a11yResults).toHaveNoViolations();
        });

        describe('when user clicks delete', () => {
            const mockGetSession = jest.mocked(supabase.auth.getSession);

            beforeAll(() => {
                mockGetSession.mockResolvedValue(sessionWithUser);
            });

            afterAll(() => {
                jest.resetAllMocks();
            });

            it('opens the confirm dialog', async () => {
                const { user, mockPostDelete } = await act(async () =>
                    renderFeed({ posts: POSTS }),
                );

                await user.click(screen.getByText(/delete/i));

                expect(screen.getByRole('dialog')).toBeInTheDocument();

                await user.click(screen.getByText(/yes/i));

                expect(mockPostDelete).toHaveBeenCalledTimes(1);
                expect(mockPostDelete).toHaveBeenCalledWith(POSTS[0].id);

                await waitFor(() =>
                    expect(
                        screen.queryByRole('dialog'),
                    ).not.toBeInTheDocument(),
                );
            });
        });
    });
});

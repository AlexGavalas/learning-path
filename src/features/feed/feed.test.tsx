import { axe } from 'jest-axe';

import { supabase } from '~lib/supabase';
import { UserContextProvider } from '~lib/use-user';
import { act, renderWithUser, screen, waitFor } from '~test/helpers';

import { type UserPost } from '../../../types/notes.types';
import { Feed } from './feed';

jest.mock('~lib/supabase');

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

const renderFeed = ({ posts }: { posts: UserPost[] }) => {
    const mockPostDelete = jest.fn();
    const mockPostUpdate = jest.fn();

    const renderResult = renderWithUser(
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

describe('<Feed />', () => {
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

            describe('when onPostDelete resolves', () => {
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

            describe('when onPostDelete rejects', () => {
                it('shows the error message', async () => {
                    const { user, mockPostDelete } = await act(async () =>
                        renderFeed({ posts: POSTS }),
                    );

                    const errorMessage = 'error';

                    mockPostDelete.mockRejectedValue(new Error(errorMessage));

                    await user.click(screen.getByText(/delete/i));
                    await user.click(screen.getByText(/yes/i));

                    expect(screen.getByRole('dialog')).toBeInTheDocument();
                    expect(screen.getByText(errorMessage)).toBeInTheDocument();
                });

                it('shows a generic error', async () => {
                    const { user, mockPostDelete } = await act(async () =>
                        renderFeed({ posts: POSTS }),
                    );

                    mockPostDelete.mockRejectedValue({});

                    await user.click(screen.getByText(/delete/i));
                    await user.click(screen.getByText(/yes/i));

                    expect(screen.getByRole('dialog')).toBeInTheDocument();
                    expect(
                        screen.getByText(/unknown error/i),
                    ).toBeInTheDocument();
                });
            });
        });
    });
});

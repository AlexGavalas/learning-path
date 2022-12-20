import { useState } from 'react';
import { axe } from 'jest-axe';

import type { Post } from '~lib/posts';

import { renderWithUser, screen } from '~test/helpers';
import { supabase } from '~lib/supabase';
import { SearchArea } from './search-area';

jest.mock('~lib/supabase');

const POSTS: Post[] = [
    {
        id: '1',
        date: '2022-01-01',
        mdxSource: {
            compiledSource: 'markdown',
        },
        title: 'title',
        updated: '2022-01-01',
    },
];

const TestComponent = () => {
    const [posts, setPosts] = useState(POSTS);
    const [, setLines] = useState({});

    return <SearchArea posts={posts} setLines={setLines} setPosts={setPosts} />;
};

const renderSearchArea = () => renderWithUser(<TestComponent />);

describe('<SearchArea />', () => {
    it('renders', () => {
        const { container } = renderSearchArea();

        expect(container).toMatchSnapshot();
    });

    it('is accessible', async () => {
        const { container } = renderSearchArea();

        const a11yResults = await axe(container);

        expect(a11yResults).toHaveNoViolations();
    });

    describe('when search input is empty', () => {
        it('clear button is hidden', () => {
            renderSearchArea();

            const clearButton = screen.queryByText(/clear/i);

            expect(clearButton).not.toBeInTheDocument();
        });
    });

    describe('when user presses "/"', () => {
        it('search input receives focus', async () => {
            const { user } = renderSearchArea();

            expect(screen.getByRole('textbox')).not.toHaveFocus();

            await user.keyboard('/');

            expect(screen.getByRole('textbox')).toHaveFocus();
        });
    });

    describe('when user types in search input', () => {
        it('can clear the input', async () => {
            const { user } = renderSearchArea();

            const searchInput = screen.getByRole('textbox');

            expect(searchInput).toHaveValue('');

            await user.keyboard('/abc');

            expect(searchInput).toHaveValue('abc');

            await user.click(screen.getByText(/clear/i));

            expect(searchInput).toHaveValue('');
        });

        describe('when user clicks search', () => {
            const mockRpc = jest.mocked(supabase.rpc);

            beforeAll(() => {
                mockRpc.mockResolvedValue({
                    data: [{ id: 1, line: 'line', title: 'title' }],
                    count: 1,
                    error: null,
                    status: 200,
                    statusText: 'ok',
                });

                jest.spyOn(console, 'error').mockImplementation(() => void 0);
            });

            afterAll(() => {
                jest.resetAllMocks();
            });

            it('does nothing when the search query is empty', async () => {
                const { user } = renderSearchArea();

                await user.click(
                    screen.getByRole('button', { name: /search/i }),
                );

                expect(mockRpc).not.toHaveBeenCalled();
            });

            it('calls the supabase rpc when it has a query', async () => {
                const { user } = renderSearchArea();
                const searchQuery = 'abc';

                await user.keyboard(`/${searchQuery}`);

                await user.click(
                    screen.getByRole('button', { name: /search/i }),
                );

                expect(mockRpc).toHaveBeenCalledTimes(1);
                expect(mockRpc).toHaveBeenCalledWith('search_notes', {
                    q: searchQuery,
                });
            });

            it('handles errors', async () => {
                mockRpc.mockRejectedValueOnce('error');

                const { user } = renderSearchArea();
                const searchQuery = 'abc';

                await user.keyboard(`/${searchQuery}`);

                await user.click(
                    screen.getByRole('button', { name: /search/i }),
                );

                expect(console.error).toHaveBeenCalledTimes(1);
            });
        });
    });
});

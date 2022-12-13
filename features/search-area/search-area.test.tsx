import { ReactElement, useState } from 'react';
import { render, RenderOptions, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';

import type { Post } from '~lib/posts';
import { SearchArea } from './search-area';

jest.mock('~lib/supabase', () => ({
    supabase: jest.fn(),
}));

const setup = (ui: ReactElement, options?: RenderOptions) => ({
    user: userEvent.setup(),
    ...render(ui, options),
});

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
    const [_, setLines] = useState({});

    return <SearchArea posts={posts} setLines={setLines} setPosts={setPosts} />;
};

describe('<SearchArea />', () => {
    const renderSearchArea = () => setup(<TestComponent />);

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
        it('shows the clear button', async () => {
            const { user } = renderSearchArea();

            await user.keyboard('/');
            await user.keyboard('abc');

            const clearButton = screen.getByText(/clear/i);

            expect(clearButton).toBeInTheDocument();
        });
    });
});
import { axe } from 'jest-axe';

import { renderWithUser, screen } from '~test/helpers';

import { SearchArea } from './search-area';

const mockPush = jest.fn();

jest.mock('next/router', () => ({
    useRouter() {
        return {
            route: '',
            pathname: '',
            query: '',
            asPath: '',
            push: mockPush,
            events: {
                on: jest.fn(),
                off: jest.fn(),
            },
            beforePopState: jest.fn(() => null),
            prefetch: jest.fn(() => null),
        };
    },
}));

const renderSearchArea = () => renderWithUser(<SearchArea />);

const baseURL = new URL('http://localhost/');

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

            const url = new URL(baseURL);
            url.searchParams.delete('q');

            expect(mockPush).toHaveBeenCalledTimes(1);
            expect(mockPush).toHaveBeenCalledWith(url);
        });

        describe('when user clicks search', () => {
            it('does nothing when the search query is empty', async () => {
                const { user } = renderSearchArea();

                await user.click(
                    screen.getByRole('button', { name: /search/i }),
                );

                expect(mockPush).toHaveBeenCalledTimes(1);
                expect(mockPush).toHaveBeenCalledWith(baseURL);
            });

            it('calls the supabase rpc when it has a query', async () => {
                const { user } = renderSearchArea();
                const searchQuery = 'abc';

                await user.keyboard(`/${searchQuery}`);

                await user.click(
                    screen.getByRole('button', { name: /search/i }),
                );

                const url = new URL(baseURL);
                url.searchParams.set('q', searchQuery);

                expect(mockPush).toHaveBeenCalledTimes(1);
                expect(mockPush).toHaveBeenCalledWith(url);
            });
        });
    });
});

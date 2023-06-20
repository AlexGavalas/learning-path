import { axe } from 'jest-axe';

import { renderWithUser, screen } from '~test/helpers';

import { SearchArea } from './search-area';

const baseURL = new URL('http://localhost/');

describe('<SearchArea />', () => {
    beforeAll(() => {
        jest.spyOn(window, 'location', 'get').mockReturnValue({
            ancestorOrigins: [] as unknown as DOMStringList,
            hash: '',
            host: baseURL.host,
            hostname: baseURL.hostname,
            href: baseURL.href,
            origin: baseURL.origin,
            pathname: baseURL.pathname,
            port: baseURL.port,
            protocol: baseURL.protocol,
            search: baseURL.search,
            assign: jest.fn(),
            reload: jest.fn(),
            replace: jest.fn(),
            toString: jest.fn(),
        });
    });

    it('renders', () => {
        const { container } = renderWithUser(<SearchArea q="" />);

        expect(container).toMatchSnapshot();
    });

    it('is accessible', async () => {
        const { container } = renderWithUser(<SearchArea q="" />);

        const a11yResults = await axe(container);

        expect(a11yResults).toHaveNoViolations();
    });

    describe('when user presses "/"', () => {
        it('search input receives focus', async () => {
            const { user } = renderWithUser(<SearchArea q="" />);

            expect(screen.getByRole('textbox')).not.toHaveFocus();

            await user.keyboard('/');

            expect(screen.getByRole('textbox')).toHaveFocus();
        });
    });

    describe('when user types in search input', () => {
        describe('when user clicks search', () => {
            it('does nothing when the search query is empty', async () => {
                const { user } = renderWithUser(<SearchArea q="" />);

                await user.click(
                    screen.getByRole('button', { name: /search/i }),
                );

                const url = new URL(baseURL);
                url.searchParams.delete('q');

                // TODO
            });

            it('navigates the user when it has a query', async () => {
                const { user } = renderWithUser(<SearchArea q="" />);
                const searchQuery = 'abc';

                await user.keyboard(`/${searchQuery}`);

                await user.click(
                    screen.getByRole('button', { name: /search/i }),
                );

                const url = new URL(baseURL);
                url.searchParams.set('q', searchQuery);

                // TODO
            });
        });
    });
});

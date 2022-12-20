import { PropsWithChildren } from 'react';
import { axe } from 'jest-axe';
import { ThemeProvider } from 'next-themes';

import { renderWithUser, screen, act } from '~test/helpers';
import { Header } from './header';

const Wrapper = ({ children }: PropsWithChildren) => (
    <ThemeProvider attribute="class">{children}</ThemeProvider>
);

const renderHeader = () => renderWithUser(<Header />, { wrapper: Wrapper });

describe('<Header />', () => {
    it('renders', () => {
        const { container } = renderHeader();

        expect(container).toMatchSnapshot();
    });

    it('is accessible', async () => {
        const { container } = renderHeader();

        // TODO: https://www.benmvp.com/blog/avoiding-react-act-warning-when-accessibility-testing-next-link-jest-axe/
        await act(async () => {
            const a11yResults = await axe(container);

            expect(a11yResults).toHaveNoViolations();
        });
    });

    describe('when user toggles theme', () => {
        it('changes theme', async () => {
            const { user } = renderHeader();

            const button = screen.getByRole('button', { name: 'Moon' });

            await user.click(button);

            const buttonImage = screen.getByRole('img');

            expect(buttonImage).toHaveAttribute('alt', 'Sun');

            await user.click(button);

            expect(buttonImage).toHaveAttribute('alt', 'Moon');
        });
    });
});

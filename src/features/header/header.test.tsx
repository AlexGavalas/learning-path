import { PropsWithChildren, ReactElement } from 'react';
import { render, RenderOptions, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { ThemeProvider } from 'next-themes';

import { Header } from './header';

const Wrapper = ({ children }: PropsWithChildren) => (
    <ThemeProvider attribute="class">{children}</ThemeProvider>
);

const setup = (ui: ReactElement, options: RenderOptions) => ({
    user: userEvent.setup(),
    ...render(ui, options),
});

describe('<Header />', () => {
    const renderHeader = () => setup(<Header />, { wrapper: Wrapper });

    it('renders', async () => {
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

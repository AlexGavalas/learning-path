import { axe } from 'jest-axe';

import { renderWithUser, screen } from '~test/helpers';

import { ThemeSwitch } from './theme-switch';

describe('<ThemeSwitch />', () => {
    it('renders', () => {
        const { container } = renderWithUser(<ThemeSwitch />);

        expect(container).toMatchSnapshot();
    });

    it('is accessible', async () => {
        const { container } = renderWithUser(<ThemeSwitch />);

        const a11yResults = await axe(container);

        expect(a11yResults).toHaveNoViolations();
    });

    describe('when user toggles theme', () => {
        it('changes theme', async () => {
            const { user } = renderWithUser(<ThemeSwitch />);

            const button = screen.getByRole('button', { name: 'Moon' });

            await user.click(button);

            const buttonImage = screen.getByRole('img');

            expect(buttonImage).toHaveAttribute('alt', 'Sun');

            await user.click(button);

            expect(buttonImage).toHaveAttribute('alt', 'Moon');
        });
    });
});

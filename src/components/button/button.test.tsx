import { axe } from 'jest-axe';

import { renderWithUser } from '~test/helpers';

import { Button } from './button';

describe('<Button />', () => {
    it('renders', () => {
        const { container } = renderWithUser(<Button>click me</Button>);

        expect(container).toMatchSnapshot();
    });

    it('is accessible', async () => {
        const { container } = renderWithUser(<Button>click me</Button>);

        const a11yResults = await axe(container);

        expect(a11yResults).toHaveNoViolations();
    });
});

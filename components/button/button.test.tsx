import { render } from '@testing-library/react';
import { axe } from 'jest-axe';

import { Button } from './button';

describe('<Button />', () => {
    it('renders', () => {
        const { container } = render(<Button>click me</Button>);

        expect(container).toMatchSnapshot();
    });

    it('is accessible', async () => {
        const { container } = render(<Button>click me</Button>);

        const a11yResults = await axe(container);

        expect(a11yResults).toHaveNoViolations();
    });

    describe('with danger variant', () => {
        it('renders a danger button', () => {
            const { container } = render(
                <Button variant="danger">click me</Button>,
            );

            expect(container).toMatchSnapshot();
        });
    });
});

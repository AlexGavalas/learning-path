import { render } from '@testing-library/react';
import { axe } from 'jest-axe';

import { Input } from './input';

describe('<Input />', () => {
    it('renders', () => {
        const { container } = render(<Input label="a label" />);

        expect(container).toMatchSnapshot();
    });

    it('is accessible', async () => {
        const { container } = render(<Input label="a label" />);

        const a11yResults = await axe(container);

        expect(a11yResults).toHaveNoViolations();
    });
});

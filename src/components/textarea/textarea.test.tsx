import { render } from '@testing-library/react';
import { axe } from 'jest-axe';

import { Textarea } from './textarea';

describe('<Textarea />', () => {
    it('renders', () => {
        const { container } = render(<Textarea label="a label" />);

        expect(container).toMatchSnapshot();
    });

    it('is accessible', async () => {
        const { container } = render(<Textarea label="a label" />);

        const a11yResults = await axe(container);

        expect(a11yResults).toHaveNoViolations();
    });
});

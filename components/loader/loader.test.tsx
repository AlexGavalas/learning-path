import { render } from '@testing-library/react';
import { axe } from 'jest-axe';

import { Loader } from './loader';

describe('<Loader />', () => {
    it('renders', () => {
        const { container } = render(<Loader />);

        expect(container).toMatchSnapshot();
    });

    it('is accessible', async () => {
        const { container } = render(<Loader />);

        const a11yResults = await axe(container);

        expect(a11yResults).toHaveNoViolations();
    });
});

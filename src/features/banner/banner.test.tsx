import { render } from '@testing-library/react';
import { axe } from 'jest-axe';

import { Banner } from './banner';

describe('<Banner />', () => {
    it('renders', () => {
        const { container } = render(<Banner />);

        expect(container).toMatchSnapshot();
    });

    it('is accessible', async () => {
        const { container } = render(<Banner />);

        const a11yResults = await axe(container);

        expect(a11yResults).toHaveNoViolations();
    });
});

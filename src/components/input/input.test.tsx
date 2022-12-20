import { axe } from 'jest-axe';

import { renderWithUser } from '~test/helpers';
import { Input } from './input';

describe('<Input />', () => {
    it('renders', () => {
        const { container } = renderWithUser(<Input label="a label" />);

        expect(container).toMatchSnapshot();
    });

    it('is accessible', async () => {
        const { container } = renderWithUser(<Input label="a label" />);

        const a11yResults = await axe(container);

        expect(a11yResults).toHaveNoViolations();
    });
});

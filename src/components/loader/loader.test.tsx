import { axe } from 'jest-axe';

import { renderWithUser } from '~test/helpers';
import { Loader } from './loader';

describe('<Loader />', () => {
    it('renders', () => {
        const { container } = renderWithUser(<Loader />);

        expect(container).toMatchSnapshot();
    });

    it('is accessible', async () => {
        const { container } = renderWithUser(<Loader />);

        const a11yResults = await axe(container);

        expect(a11yResults).toHaveNoViolations();
    });
});

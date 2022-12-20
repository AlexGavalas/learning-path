import { axe } from 'jest-axe';

import { renderWithUser } from '~test/helpers';
import { Banner } from './banner';

describe('<Banner />', () => {
    it('renders', () => {
        const { container } = renderWithUser(<Banner />);

        expect(container).toMatchSnapshot();
    });

    it('is accessible', async () => {
        const { container } = renderWithUser(<Banner />);

        const a11yResults = await axe(container);

        expect(a11yResults).toHaveNoViolations();
    });
});

import { axe } from 'jest-axe';

import { renderWithUser } from '~test/helpers';

import { Textarea } from './textarea';

describe('<Textarea />', () => {
    it('renders', () => {
        const { container } = renderWithUser(<Textarea label="a label" />);

        expect(container).toMatchSnapshot();
    });

    it('is accessible', async () => {
        const { container } = renderWithUser(<Textarea label="a label" />);

        const a11yResults = await axe(container);

        expect(a11yResults).toHaveNoViolations();
    });
});

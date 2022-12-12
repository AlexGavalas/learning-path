import { render } from '@testing-library/react';
import { axe } from 'jest-axe';

import { ListItem } from './list-item';

describe('<ListItem />', () => {
    it('renders', () => {
        const { container } = render(<ListItem>list item</ListItem>);

        expect(container).toMatchSnapshot();
    });

    it('is accessible', async () => {
        const { container } = render(
            <ul>
                <ListItem>list item</ListItem>
            </ul>,
        );

        const a11yResults = await axe(container);

        expect(a11yResults).toHaveNoViolations();
    });
});

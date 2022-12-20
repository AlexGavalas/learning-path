import { axe } from 'jest-axe';

import { renderWithUser } from '~test/helpers';
import { ListItem } from './list-item';

describe('<ListItem />', () => {
    it('renders', () => {
        const { container } = renderWithUser(<ListItem>list item</ListItem>);

        expect(container).toMatchSnapshot();
    });

    it('is accessible', async () => {
        const { container } = renderWithUser(
            <ul>
                <ListItem>list item</ListItem>
            </ul>,
        );

        const a11yResults = await axe(container);

        expect(a11yResults).toHaveNoViolations();
    });
});

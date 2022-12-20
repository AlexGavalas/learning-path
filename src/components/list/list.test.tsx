import { axe } from 'jest-axe';

import { renderWithUser } from '~test/helpers';

import { List } from './list';
import { ListItem } from './list-item';

describe('<List />', () => {
    it('renders', () => {
        const { container } = renderWithUser(
            <List>
                <ListItem>list item</ListItem>
            </List>,
        );

        expect(container).toMatchSnapshot();
    });

    it('is accessible', async () => {
        const { container } = renderWithUser(
            <List>
                <ListItem>list item</ListItem>
            </List>,
        );

        const a11yResults = await axe(container);

        expect(a11yResults).toHaveNoViolations();
    });
});

import { render } from '@testing-library/react';
import { axe } from 'jest-axe';

import { List } from './list';
import { ListItem } from './list-item';

describe('<List />', () => {
    it('renders', () => {
        const { container } = render(
            <List>
                <ListItem>list item</ListItem>
            </List>,
        );

        expect(container).toMatchSnapshot();
    });

    it('is accessible', async () => {
        const { container } = render(
            <List>
                <ListItem>list item</ListItem>
            </List>,
        );

        const a11yResults = await axe(container);

        expect(a11yResults).toHaveNoViolations();
    });
});

import { render } from '@testing-library/react';

import { Layout } from './layout';

describe('<Layout />', () => {
    it('renders', () => {
        const { container } = render(<Layout>content</Layout>);

        expect(container).toMatchSnapshot();
    });
});

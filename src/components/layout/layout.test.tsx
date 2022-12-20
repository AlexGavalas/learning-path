import { renderWithUser } from '~test/helpers';
import { Layout } from './layout';

describe('<Layout />', () => {
    it('renders', () => {
        const { container } = renderWithUser(<Layout>content</Layout>);

        expect(container).toMatchSnapshot();
    });
});

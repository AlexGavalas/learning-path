import { render } from '~test/helpers';

import { Head } from './head';

describe('<Head />', () => {
    it('renders', () => {
        const { container } = render(<Head />);

        expect(container).toMatchSnapshot();
    });
});

import { renderWithUser } from '~test/helpers';

import { YoutubeIcon } from './icons';

describe('<Icons />', () => {
    describe('<YoutubeIcon />', () => {
        it('renders', () => {
            const { container } = renderWithUser(<YoutubeIcon />);

            expect(container).toMatchSnapshot();
        });
    });
});

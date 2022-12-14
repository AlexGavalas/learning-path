import { render } from '@testing-library/react';
import { axe } from 'jest-axe';

import { YoutubeIcon } from './icons';

describe('<Icons />', () => {
    describe('<YoutubeIcon />', () => {
        it('renders', () => {
            const { container } = render(<YoutubeIcon />);

            expect(container).toMatchSnapshot();
        });
    });
});

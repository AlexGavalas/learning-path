import { axe } from 'jest-axe';

import { renderWithUser } from '~test/helpers';

import { type NoteMDX } from '../../../types/notes.types';
import { PostHeader } from './post-header';

describe('<PostHeader />', () => {
    const post: NoteMDX = {
        created: '2022-01-01',
        id: 1,
        line: 'line',
        filename: 'filename',
        mdxSource: {
            compiledSource: '',
        },
        title: 'title',
        updated: '2022-01-01',
    };

    it('renders', () => {
        const { container } = renderWithUser(<PostHeader post={post} />);

        expect(container).toMatchSnapshot();
    });

    it('is accessible', async () => {
        const { container } = renderWithUser(<PostHeader post={post} />);

        const a11yResults = await axe(container);

        expect(a11yResults).toHaveNoViolations();
    });
});

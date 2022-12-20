import { axe } from 'jest-axe';

import { renderWithUser } from '~test/helpers';
import { PostHeader } from './post-header';
import { Post } from '~lib/posts';

describe('<PostHeader />', () => {
    const post: Post = {
        date: '2022-01-01',
        id: '1',
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

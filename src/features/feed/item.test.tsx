import { renderWithUser, screen } from '~test/helpers';

import { ListItem } from './item';

const post: UserPost = {
    id: '1',
    created_at: new Date('2022-01-01').toISOString(),
    name: 'name',
    post: 'post',
};

const renderListItem = ({ isMine }: { isMine: boolean }) => {
    const mockOnPostDelete = jest.fn();
    const mockOnPostUpdate = jest.fn();

    const renderResult = renderWithUser(
        <ListItem
            post={post}
            isMine={isMine}
            onPostDelete={mockOnPostDelete}
            onPostUpdate={mockOnPostUpdate}
        />,
    );

    return {
        ...renderResult,
        mockOnPostDelete,
        mockOnPostUpdate,
    };
};

describe('<ListItem />', () => {
    describe('when the post is not mine', () => {
        it('renders', () => {
            const { container } = renderListItem({ isMine: false });

            expect(container).toMatchSnapshot();
        });

        it('does not expose controls', () => {
            renderListItem({ isMine: false });

            expect(screen.queryByRole('button')).not.toBeInTheDocument();
        });
    });

    describe('when the post is mine', () => {
        it('renders', () => {
            const { container } = renderListItem({ isMine: true });

            expect(container).toMatchSnapshot();
        });

        it('exposes two buttons', () => {
            renderListItem({ isMine: true });

            expect(screen.queryAllByRole('button')).toHaveLength(2);
        });

        describe('when user clicks delete', () => {
            it('calls onPostDelete', async () => {
                const { user, mockOnPostDelete } = renderListItem({
                    isMine: true,
                });

                await user.click(
                    screen.getByRole('button', { name: /delete/i }),
                );

                expect(mockOnPostDelete).toHaveBeenCalledTimes(1);
                expect(mockOnPostDelete).toHaveBeenCalledWith(post.id);
            });
        });

        describe('when user clicks edit', () => {
            it('opens edit dialog', async () => {
                const { user } = renderListItem({
                    isMine: true,
                });

                await user.click(screen.getByRole('button', { name: /edit/i }));

                expect(screen.getByRole('dialog')).toBeInTheDocument();
            });

            describe('when user types and clicks save', () => {
                it('calls onPostUpdate', async () => {
                    const { user, mockOnPostUpdate } = renderListItem({
                        isMine: true,
                    });

                    await user.click(
                        screen.getByRole('button', { name: /edit/i }),
                    );

                    const textInput = screen.getByRole('textbox');
                    const addedText = 'abc';
                    const finalPost = `${post.post}${addedText}`;

                    await user.type(textInput, addedText);

                    expect(textInput).toHaveValue(finalPost);

                    await user.click(
                        screen.getByRole('button', { name: /save/i }),
                    );

                    expect(mockOnPostUpdate).toHaveBeenCalledTimes(1);
                    expect(mockOnPostUpdate).toHaveBeenCalledWith(
                        post.id,
                        finalPost,
                    );
                });
            });

            describe('when user clears the input and clicks save', () => {
                it('does not call onPostUpdate', async () => {
                    const { user, mockOnPostUpdate } = renderListItem({
                        isMine: true,
                    });

                    await user.click(
                        screen.getByRole('button', { name: /edit/i }),
                    );

                    const textInput = screen.getByRole('textbox');

                    await user.clear(textInput);

                    await user.click(
                        screen.getByRole('button', { name: /save/i }),
                    );

                    expect(mockOnPostUpdate).not.toHaveBeenCalled();
                });
            });
        });
    });
});

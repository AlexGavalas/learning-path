import { axe } from 'jest-axe';

import { renderWithUser, screen } from '~test/helpers';
import { Dialog } from './dialog';

describe('<Dialog />', () => {
    describe('when it is closed', () => {
        it('renders', () => {
            renderWithUser(<Dialog>content</Dialog>);

            expect(document.body).toMatchSnapshot();
        });
    });

    describe('when it is open', () => {
        it('renders', () => {
            renderWithUser(<Dialog open>content</Dialog>);

            expect(document.body).toMatchSnapshot();
        });

        it('is accessible', async () => {
            renderWithUser(<Dialog open>content</Dialog>);

            const a11yResults = await axe(document.body);

            expect(a11yResults).toHaveNoViolations();
        });

        it('can be navigated using tab in a circular way', async () => {
            const { user } = renderWithUser(
                <Dialog open>
                    <input id="1" />
                    <input id="2" autoFocus />
                    <input id="3" />
                </Dialog>,
            );

            expect(document.activeElement?.id).toBe('2');

            await user.tab();

            expect(document.activeElement?.id).toBe('3');

            await user.tab();

            expect(document.activeElement?.id).toBe('1');
        });

        it('can be navigated backwards using shift+tab', async () => {
            const { user } = renderWithUser(
                <Dialog open>
                    <input id="1" autoFocus />
                    <input id="2" />
                    <input id="3" />
                </Dialog>,
            );

            expect(document.activeElement?.id).toBe('1');

            await user.keyboard('{Shift>}');
            await user.tab();

            expect(document.activeElement?.id).toBe('3');
        });

        describe('when user presses Esc', () => {
            it('calls onClickoutside', async () => {
                const mockOnClickoutside = jest.fn();

                const { user } = renderWithUser(
                    <Dialog onClickOutside={mockOnClickoutside} open>
                        content
                    </Dialog>,
                );

                await user.keyboard('{Escape}');

                expect(mockOnClickoutside).toHaveBeenCalledTimes(1);
            });
        });

        describe('when user clicks outside', () => {
            it('calls onClickoutside', async () => {
                const mockOnClickoutside = jest.fn();

                const { user } = renderWithUser(
                    <Dialog onClickOutside={mockOnClickoutside} open>
                        content
                    </Dialog>,
                );

                await user.click(screen.getByRole('dialog'));

                expect(mockOnClickoutside).toHaveBeenCalledTimes(0);

                await user.click(document.body);

                expect(mockOnClickoutside).toHaveBeenCalledTimes(1);
            });
        });
    });
});

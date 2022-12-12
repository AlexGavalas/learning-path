import { ReactElement } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';

import { Dialog } from './dialog';

const setup = (ui: ReactElement) => ({
    user: userEvent.setup(),
    ...render(ui, {}),
});

describe('<Dialog />', () => {
    describe('when it is closed', () => {
        it('renders', () => {
            const { container } = render(<Dialog>content</Dialog>);

            expect(container).toMatchSnapshot();
        });
    });

    describe('when it is open', () => {
        it('renders', () => {
            const { container } = render(<Dialog open>content</Dialog>);

            expect(container).toMatchSnapshot();
        });

        it('is accessible', async () => {
            const { container } = render(<Dialog open>content</Dialog>);

            const a11yResults = await axe(container);

            expect(a11yResults).toHaveNoViolations();
        });

        it('can be navigated using tab in a circular way', async () => {
            const { user } = setup(
                <Dialog open>
                    <input id="1" />
                    <input id="2" />
                    <input id="3" />
                </Dialog>,
            );

            expect(document.activeElement?.id).toBe('1');

            await user.tab();

            expect(document.activeElement?.id).toBe('2');

            await user.tab();

            expect(document.activeElement?.id).toBe('3');

            await user.tab();

            expect(document.activeElement?.id).toBe('1');
        });

        it('can be navigated backwards using shift+tab', async () => {
            const { user } = setup(
                <Dialog open>
                    <input id="1" />
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

                const { user } = setup(
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

                const { user, getByRole } = setup(
                    <Dialog onClickOutside={mockOnClickoutside} open>
                        content
                    </Dialog>,
                );

                await user.click(getByRole('dialog'));

                expect(mockOnClickoutside).toHaveBeenCalledTimes(0);

                await user.click(document.body);

                expect(mockOnClickoutside).toHaveBeenCalledTimes(1);
            });
        });
    });
});

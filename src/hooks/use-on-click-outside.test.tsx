import { useRef } from 'react';

import { renderWithUser, screen } from '~test/helpers';

import { useOnClickOutside } from './use-on-click-outside';

type Callback = Parameters<typeof useOnClickOutside>[1];

const Component = ({ callback }: { callback: Callback }) => {
    const ref = useRef<HTMLDivElement>(null);

    useOnClickOutside(ref, callback);

    return (
        <div>
            outside
            <div ref={ref}>target</div>
        </div>
    );
};

describe('useOnClickOutside', () => {
    describe('when user clicks outside', () => {
        test('calls callback', async () => {
            const callback = jest.fn();

            const { user } = renderWithUser(<Component callback={callback} />);

            expect(callback).toHaveBeenCalledTimes(0);

            await user.click(screen.getByText('outside'));

            expect(callback).toHaveBeenCalledTimes(1);
        });
    });

    describe('when user clicks the target', () => {
        test('does not call the callback', async () => {
            const callback = jest.fn();

            const { user } = renderWithUser(<Component callback={callback} />);

            expect(callback).toHaveBeenCalledTimes(0);

            await user.click(screen.getByText('target'));

            expect(callback).toHaveBeenCalledTimes(0);
        });
    });

    test('removes the event listener when unmounts', async () => {
        const callback = jest.fn();

        jest.spyOn(document, 'removeEventListener');

        const { unmount } = renderWithUser(<Component callback={callback} />);

        expect(callback).toHaveBeenCalledTimes(0);

        unmount();

        expect(document.removeEventListener).toHaveBeenCalledTimes(2);

        expect(document.removeEventListener).toHaveBeenNthCalledWith(
            1,
            'click',
            expect.any(Function),
        );

        expect(document.removeEventListener).toHaveBeenNthCalledWith(
            2,
            'touchstart',
            expect.any(Function),
        );
    });
});

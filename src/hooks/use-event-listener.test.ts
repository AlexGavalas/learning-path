import { renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useEventListener } from './use-event-listener';

describe('useEventListener', () => {
    it('calls handler when event is dispatched', async () => {
        const text = 'something';
        const mockHandler = jest.fn();
        const user = userEvent.setup();

        renderHook(() => useEventListener('keydown', mockHandler));

        await user.keyboard(text);

        expect(mockHandler).toHaveBeenCalledTimes(text.length);
    });

    it('does not call handler when another event occurs', async () => {
        const mockHandler = jest.fn();
        const user = userEvent.setup();

        renderHook(() => useEventListener('keydown', mockHandler));

        await user.click(document.body);

        expect(mockHandler).toHaveBeenCalledTimes(0);
    });

    it('cleanups on umount', async () => {
        const mockHandler = jest.fn();
        const user = userEvent.setup();

        const { unmount } = renderHook(() =>
            useEventListener('keydown', mockHandler),
        );

        unmount();

        await user.keyboard('something');

        expect(mockHandler).toHaveBeenCalledTimes(0);
    });
});

import { renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useKeypress } from './use-keypress';

describe('useKeypress', () => {
    it('calls handler when key is pressed', async () => {
        const triggerKey = 'a';
        const mockHandler = jest.fn();
        const user = userEvent.setup();

        renderHook(() => useKeypress(triggerKey, mockHandler));

        await user.keyboard(triggerKey);

        expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it('does not call handler when another key is pressed', async () => {
        const triggerKey = 'a';
        const targetkey = 'b';
        const mockHandler = jest.fn();
        const user = userEvent.setup();

        expect(triggerKey).not.toBe(targetkey);

        renderHook(() => useKeypress(triggerKey, mockHandler));

        await user.keyboard(targetkey);

        expect(mockHandler).toHaveBeenCalledTimes(0);
    });

    it('cleanups on umount', async () => {
        const triggerKey = 'a';
        const mockHandler = jest.fn();
        const user = userEvent.setup();

        const { unmount } = renderHook(() =>
            useKeypress(triggerKey, mockHandler),
        );

        unmount();

        await user.keyboard(triggerKey);

        expect(mockHandler).toHaveBeenCalledTimes(0);
    });
});

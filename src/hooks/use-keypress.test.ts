import { renderHookWithUser } from '~test/helpers';
import { useKeypress } from './use-keypress';

describe('useKeypress', () => {
    it('calls handler when key is pressed', async () => {
        const triggerKey = 'a';
        const mockHandler = jest.fn();

        const { user } = renderHookWithUser(() =>
            useKeypress(triggerKey, mockHandler),
        );

        await user.keyboard(triggerKey);

        expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it('does not call handler when another key is pressed', async () => {
        const triggerKey = 'a';
        const targetkey = 'b';
        const mockHandler = jest.fn();

        expect(triggerKey).not.toBe(targetkey);

        const { user } = renderHookWithUser(() =>
            useKeypress(triggerKey, mockHandler),
        );

        await user.keyboard(targetkey);

        expect(mockHandler).toHaveBeenCalledTimes(0);
    });

    it('cleanups on umount', async () => {
        const triggerKey = 'a';
        const mockHandler = jest.fn();

        const { unmount, user } = renderHookWithUser(() =>
            useKeypress(triggerKey, mockHandler),
        );

        unmount();

        await user.keyboard(triggerKey);

        expect(mockHandler).toHaveBeenCalledTimes(0);
    });
});

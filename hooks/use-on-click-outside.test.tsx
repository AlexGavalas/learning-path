import { fireEvent } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { useOnClickOutside } from './use-on-click-outside';

const appendDivToBody = () => {
    const el = document.createElement('div');
    return document.body.appendChild(el);
};

describe('Use on click outside hook', () => {
    test('should fire event', () => {
        const target = appendDivToBody();
        const outside = appendDivToBody();

        const ref = {
            current: target,
        };

        const callback = jest.fn();

        renderHook(() => useOnClickOutside(ref, callback));

        expect(callback).toHaveBeenCalledTimes(0);

        fireEvent.click(outside);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    test('should not fire event', () => {
        const target = appendDivToBody();

        const ref = {
            current: target,
        };

        const callback = jest.fn();

        renderHook(() => useOnClickOutside(ref, callback));

        expect(callback).toHaveBeenCalledTimes(0);

        fireEvent.click(target);

        expect(callback).toHaveBeenCalledTimes(0);
    });

    test('should remove event listener when unmounts', () => {
        const target = appendDivToBody();
        const outside = appendDivToBody();

        const ref = {
            current: target,
        };

        const callback = jest.fn();

        jest.spyOn(document, 'removeEventListener');

        const { unmount } = renderHook(() => useOnClickOutside(ref, callback));

        expect(callback).toHaveBeenCalledTimes(0);

        unmount();

        expect(document.removeEventListener).toHaveBeenCalledTimes(2);

        fireEvent.click(outside);

        expect(callback).toHaveBeenCalledTimes(0);
    });
});

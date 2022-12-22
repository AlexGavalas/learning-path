import { useEffect } from 'react';

export const useEventListener = <K extends keyof WindowEventMap>(
    eventName: K,
    handler: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions,
    element: HTMLElement | Document = document,
) => {
    useEffect(() => {
        element.addEventListener(eventName, handler, options);

        return () => {
            element.removeEventListener(eventName, handler);
        };
    }, [eventName, handler, element, options]);
};
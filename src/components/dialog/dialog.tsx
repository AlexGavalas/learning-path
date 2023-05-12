import {
    type DialogHTMLAttributes,
    type FC,
    useCallback,
    useEffect,
    useRef,
} from 'react';
import { createPortal } from 'react-dom';

import { useEventListener } from '~hooks/use-event-listener';
import { useOnClickOutside } from '~hooks/use-on-click-outside';

type DialogSize = 'md';

interface DialogProps extends DialogHTMLAttributes<HTMLDialogElement> {
    onClickOutside?: (event: MouseEvent | TouchEvent | KeyboardEvent) => void;
    size?: DialogSize;
}

const FOCUSABLE_ELEMENTS =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const preventDefault = (e: Event) => e.preventDefault();

const isKeyboardEvent = (e: Event): e is KeyboardEvent => 'shiftKey' in e;

const DialogContent: FC<DialogProps> = ({
    onClickOutside = () => void 0,
    size,
    children,
    ...props
}) => {
    const modalRef = useRef<HTMLDialogElement>(null);
    const previousFocusedElementRef = useRef(
        document.activeElement as HTMLElement | null,
    );

    const handleKeyPress = useCallback(
        (e: Event) => {
            if (!isKeyboardEvent(e)) return;

            if (e.key === 'Escape') {
                return onClickOutside(e);
            }

            if (e.key !== 'Tab') return;

            const [firstFocusableEl, ...rest] = Array.from(
                modalRef.current?.querySelectorAll(FOCUSABLE_ELEMENTS) ?? [],
            );

            const lastFocusableEl = rest.at(-1);

            if (e.shiftKey) {
                // if shift key pressed for shift + tab combination
                if (document.activeElement === firstFocusableEl) {
                    (lastFocusableEl as HTMLElement).focus();
                    e.preventDefault();
                }
            } else if (document.activeElement === lastFocusableEl) {
                // if tab key is pressed
                (firstFocusableEl as HTMLElement).focus();
                e.preventDefault();
            }
        },
        [onClickOutside],
    );

    useOnClickOutside(modalRef, onClickOutside);

    useEventListener('scroll', preventDefault, { passive: false });
    useEventListener('wheel', preventDefault, { passive: false });
    useEventListener('keydown', handleKeyPress);

    useEffect(() => {
        if (!props.open) return;

        const rootDiv = document.body.firstChild as HTMLElement;

        // Disable interactions with the rest of the app
        rootDiv.inert = true;

        const previousFocusedElement = previousFocusedElementRef.current;

        return () => {
            // Restore app interactivity
            rootDiv.inert = false;

            // Return focus to the trigger element
            // process.nextTick is used to focus the element
            // the exit animation is finished
            process.nextTick(() => {
                previousFocusedElement?.focus();
            });
        };
    }, [props.open]);

    return createPortal(
        <dialog
            ref={modalRef}
            open={props.open}
            className={`fixed inset-0 rounded bg-black ${
                size === 'md' ? 'w-[75%]' : ''
            }`}
        >
            {children}
        </dialog>,
        document.body,
    );
};

export const Dialog: FC<DialogProps> = (props) => (
    <>{props.open && <DialogContent {...props} />}</>
);

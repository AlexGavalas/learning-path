import { FC, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, HTMLMotionProps } from 'framer-motion';

import { useOnClickOutside } from '~hooks/use-on-click-outside';
import { variants } from './constants';

type DialogSize = 'md';

interface DialogProps extends HTMLMotionProps<'dialog'> {
    onClickOutside?: (event: MouseEvent | TouchEvent | KeyboardEvent) => void;
    size?: DialogSize;
}

const FOCUSABLE_ELEMENTS =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const DialogContent: FC<DialogProps> = ({
    onClickOutside = () => void 0,
    size,
    children,
    ...props
}) => {
    const modalRef = useRef<HTMLDialogElement | null>(null);
    const previousFocusedElementRef = useRef(
        document.activeElement as HTMLElement | null,
    );

    useOnClickOutside(modalRef, onClickOutside);

    useEffect(() => {
        const handler = (e: Event) => e.preventDefault();

        document.addEventListener('scroll', handler, { passive: false });
        document.addEventListener('wheel', handler, { passive: false });

        return () => {
            document.removeEventListener('scroll', handler);
            document.removeEventListener('wheel', handler);
        };
    }, []);

    useEffect(() => {
        if (!props.open) return;

        const rootDiv = document.body.firstChild as HTMLElement;

        // Disable interactions with the rest of the app
        rootDiv.inert = true;

        const focusableContent =
            modalRef.current?.querySelectorAll(FOCUSABLE_ELEMENTS) ?? [];

        const firstFocusableEl = focusableContent[0];

        const lastFocusableEl = focusableContent[focusableContent.length - 1];

        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                return onClickOutside(e);
            }

            const isTabPressed = e.key === 'Tab';

            if (!isTabPressed) return;

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
        };

        document.addEventListener('keydown', handleKeyPress);

        (firstFocusableEl as HTMLElement)?.focus();

        const previousFocusedElement = previousFocusedElementRef.current;

        return () => {
            document.removeEventListener('keydown', handleKeyPress);

            // Restore app interactivity
            rootDiv.inert = false;

            // Return focus to the trigger element
            // process.nextTick is used to focus the element
            // after framer-motion finishes the exit animation
            process.nextTick(() => {
                previousFocusedElement?.focus();
            });
        };
    }, [props.open, onClickOutside]);

    return createPortal(
        <motion.dialog
            ref={modalRef}
            initial="hidden"
            animate="enter"
            exit="hidden"
            variants={variants}
            transition={{ type: 'linear' }}
            open={props.open}
            className={`fixed inset-0 rounded bg-black ${
                size === 'md' ? 'w-[75%]' : ''
            }`}
        >
            {children}
        </motion.dialog>,
        document.body,
    );
};

export const Dialog: FC<DialogProps> = (props) => (
    <AnimatePresence>
        {props.open && <DialogContent {...props} />}
    </AnimatePresence>
);

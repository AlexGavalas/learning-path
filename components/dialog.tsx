import { FC, useRef, useEffect } from 'react';
import { AnimatePresence, motion, HTMLMotionProps } from 'framer-motion';

import { useOnClickOutside } from '../hooks/use-on-click-outside';

type DialogSize = 'md';

interface DialogProps extends HTMLMotionProps<'dialog'> {
    onClickOutside?: () => void;
    size?: DialogSize;
}

const variants = {
    hidden: {
        opacity: 0,
    },
    enter: {
        opacity: 1,
    },
};

const FOCUSABLE_ELEMENTS =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const DialogContent: FC<DialogProps> = ({
    onClickOutside = () => void 0,
    size,
    children,
    ...props
}) => {
    const modalRef = useRef<HTMLDialogElement>(null);

    useOnClickOutside(modalRef, onClickOutside);

    // Hook to return focus to the trigger element
    useEffect(() => {
        if (!modalRef.current || !props.open) return;

        const previousFocusedElement = document.activeElement as HTMLElement;

        return () => {
            // process.nextTick is used to focus the element
            // after framer-motion finishes the exit animation
            process.nextTick(() => {
                previousFocusedElement?.focus();
            });
        };
    }, [props.open]);

    useEffect(() => {
        if (!modalRef.current) return;

        // Disable body scroll
        document.body.style.overflow = 'hidden';

        const focusableContent =
            modalRef.current.querySelectorAll(FOCUSABLE_ELEMENTS);

        const firstFocusableEl = focusableContent[0];

        const lastFocusableEl = focusableContent[focusableContent.length - 1];

        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                return onClickOutside();
            }

            const isTabPressed = e.key === 'Tab' || e.keyCode === 9;

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

        (firstFocusableEl as HTMLElement).focus();

        return () => {
            document.removeEventListener('keydown', handleKeyPress);

            // Reset body scroll
            document.body.style.overflow = 'auto';
        };
    }, [props.open, onClickOutside]);

    return (
        <motion.dialog
            ref={modalRef}
            initial="hidden"
            animate="enter"
            exit="hidden"
            variants={variants}
            transition={{ type: 'linear' }}
            className={`fixed inset-0 rounded bg-black ${
                size === 'md' ? 'w-[75%]' : ''
            }`}
            {...props}
        >
            {children}
        </motion.dialog>
    );
};

export const Dialog: FC<DialogProps> = (props) => {
    return (
        <AnimatePresence>
            {props.open && <DialogContent {...props} />}
        </AnimatePresence>
    );
};

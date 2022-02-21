import { FC, useRef, DialogHTMLAttributes, useEffect } from 'react';
import { AnimatePresence, motion, HTMLMotionProps } from 'framer-motion';

import { useOnClickOutside } from '../hooks/use-on-click-outside';

interface DialogProps extends HTMLMotionProps<'dialog'> {
    onClickOutside?: () => void;
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

export const Dialog: FC<DialogProps> = ({
    children,
    onClickOutside = () => {},
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
        };
    }, [props.open, onClickOutside]);

    return (
        <AnimatePresence>
            {props.open && (
                <motion.dialog
                    ref={modalRef}
                    initial="hidden"
                    animate="enter"
                    exit="hidden"
                    variants={variants}
                    transition={{ type: 'linear' }}
                    className="inset-0 rounded bg-black"
                    {...props}
                >
                    {children}
                </motion.dialog>
            )}
        </AnimatePresence>
    );
};

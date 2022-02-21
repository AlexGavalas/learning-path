import { forwardRef, TextareaHTMLAttributes, ForwardedRef } from 'react';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextareaComponent = (
    props: TextareaProps,
    ref: ForwardedRef<HTMLTextAreaElement>
) => {
    return (
        <textarea
            {...props}
            ref={ref}
            className="resize-none p-2 w-full h-24 border-[1px] dark:border-0 border-solid bg-transparent dark:bg-neutral-800 rounded dark:placeholder-gray-300 dark:placeholder-opacity-50"
        />
    );
};

export const Textarea = forwardRef(TextareaComponent);

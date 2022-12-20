import {
    type ForwardedRef,
    type TextareaHTMLAttributes,
    forwardRef,
} from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
}

const TextareaComponent = (
    { label, ...props }: TextareaProps,
    ref: ForwardedRef<HTMLTextAreaElement>,
) => {
    return (
        <label className="flex flex-col gap-2">
            <span>{label}</span>
            <textarea
                {...props}
                ref={ref}
                className="resize-none p-2 w-full h-24 border-[1px] dark:border-0 border-solid bg-transparent dark:bg-neutral-800 rounded dark:placeholder-gray-300 dark:placeholder-opacity-50"
            />
        </label>
    );
};

export const Textarea = forwardRef(TextareaComponent);

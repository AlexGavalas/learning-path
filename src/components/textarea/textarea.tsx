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
                className="h-24 w-full resize-none rounded border-[1px] border-solid bg-transparent p-2 dark:border-0 dark:bg-neutral-800 dark:placeholder-gray-300 dark:placeholder-opacity-50"
            />
        </label>
    );
};

export const Textarea = forwardRef(TextareaComponent);

import { forwardRef, InputHTMLAttributes, ForwardedRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const InputComponent = (
    { label, ...props }: InputProps,
    ref: ForwardedRef<HTMLInputElement>,
) => {
    return (
        <label className="w-full h-full flex flex-col">
            <span>{label}</span>
            <input
                {...props}
                ref={ref}
                className="pl-2 w-full h-1/2 border-[1px] dark:border-0 border-solid bg-transparent dark:bg-neutral-800 rounded dark:placeholder-gray-300 dark:placeholder-opacity-50"
            />
        </label>
    );
};

export const Input = forwardRef(InputComponent);

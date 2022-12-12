import { forwardRef, InputHTMLAttributes, ForwardedRef } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const InputComponent = (
    props: InputProps,
    ref: ForwardedRef<HTMLInputElement>,
) => {
    return (
        <input
            {...props}
            ref={ref}
            className="pl-2 w-full h-full border-[1px] dark:border-0 border-solid bg-transparent dark:bg-neutral-800 rounded dark:placeholder-gray-300 dark:placeholder-opacity-50"
        />
    );
};

export const Input = forwardRef(InputComponent);

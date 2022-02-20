import { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = (props: InputProps) => {
    return (
        <input
            {...props}
            className="pl-2 w-full h-full border-[1px] dark:border-0 border-solid bg-transparent dark:bg-neutral-800 rounded dark:placeholder-gray-300 dark:placeholder-opacity-50"
        />
    );
};

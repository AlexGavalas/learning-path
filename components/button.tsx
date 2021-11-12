import { FC, ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: FC<ButtonProps> = ({ children, ...rest }) => (
    <button
        className="cursor-pointer p-2 bg-transparent border-none rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
        {...rest}
    >
        {children}
    </button>
);

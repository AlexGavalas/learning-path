import type { FC, ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'danger' | 'wrapper';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
}

export const Button: FC<ButtonProps> = ({ children, variant, ...rest }) => {
    let bgClass =
        variant === 'danger'
            ? 'bg-red-500 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-700'
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-600';

    if (variant === 'wrapper') {
        bgClass = 'bg-transparent hover:bg-gray-300 dark:hover:bg-gray-600';
    }

    const textClass =
        variant === 'danger' ? 'text-white' : 'text-black dark:text-white';

    return (
        <button
            {...rest}
            className={`p-2 flex items-center rounded border-0 ${textClass} ${bgClass}`}
        >
            {children}
        </button>
    );
};

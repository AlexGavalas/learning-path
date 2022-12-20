import { type ButtonHTMLAttributes, type FC } from 'react';

type ButtonVariant = 'danger' | 'wrapper' | 'default';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
}

const bgClassNamesPerVariant: Record<ButtonVariant, string> = {
    danger: 'bg-red-500 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-700',
    default:
        'bg-gray-200 hover:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-600',
    wrapper: 'bg-transparent hover:bg-gray-300 dark:hover:bg-gray-600',
};

const textClassesPerVariant: Record<ButtonVariant, string> = {
    danger: 'text-white',
    default: 'text-black dark:text-white',
    wrapper: 'text-black dark:text-white',
};

export const Button: FC<ButtonProps> = ({
    children,
    variant = 'default',
    ...rest
}) => {
    const bgClass = bgClassNamesPerVariant[variant];
    const textClass = textClassesPerVariant[variant];

    return (
        <button
            {...rest}
            className={`p-2 flex items-center rounded border-0 ${textClass} ${bgClass}`}
        >
            {children}
        </button>
    );
};

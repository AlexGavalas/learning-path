import { type ButtonHTMLAttributes, type FC } from 'react';

type ButtonVariant = 'danger' | 'wrapper' | 'default' | 'link';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
}

const bgClassNamesPerVariant: Record<ButtonVariant, string> = {
    danger: 'p-2 flex bg-red-500 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-700',
    default:
        'p-2 flex bg-gray-200 hover:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-600',
    wrapper: 'p-2 flex bg-transparent hover:bg-gray-300 dark:hover:bg-gray-600',
    link: 'p-0 my-8 inline-block bg-transparent hover:underline cursor-pointer',
};

const textClassesPerVariant: Record<ButtonVariant, string> = {
    danger: 'text-white',
    default: 'text-black dark:text-white',
    wrapper: 'text-black dark:text-white',
    link: 'text-lg text-light-primary dark:text-dark-primary',
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
            className={`items-center rounded border-0 ${textClass} ${bgClass}`}
        >
            {children}
        </button>
    );
};

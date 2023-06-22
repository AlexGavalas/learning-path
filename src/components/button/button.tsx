import type { ButtonHTMLAttributes, FC } from 'react';

type ButtonVariant = 'wrapper' | 'default';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
};

const bgClassNamesPerVariant: Record<ButtonVariant, string> = {
    default:
        'bg-slate-300 hover:bg-slate-300/75 dark:bg-slate-600 dark:hover:bg-slate-600/75',
    wrapper: 'bg-transparent hover:bg-slate-300 dark:hover:bg-slate-600',
};

export const Button: FC<ButtonProps> = ({
    children,
    variant = 'default',
    ...rest
}) => {
    const bgClass = bgClassNamesPerVariant[variant];

    return (
        <button
            {...rest}
            className={`flex items-center rounded border-0 p-2 ${bgClass}`}
        >
            {children}
        </button>
    );
};

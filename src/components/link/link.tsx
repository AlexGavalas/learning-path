import NextLink, { type LinkProps as NextLinkProps } from 'next/link';
import { type AnchorHTMLAttributes } from 'react';

type LinkProps = NextLinkProps & AnchorHTMLAttributes<HTMLAnchorElement>;

export const Link = ({ children, className, ...props }: LinkProps) => (
    <NextLink
        className={[
            'inline-block cursor-pointer bg-transparent text-lg text-light-primary hover:underline dark:text-dark-primary',
            className,
        ]
            .filter(Boolean)
            .join(' ')}
        {...props}
    >
        {children}
    </NextLink>
);

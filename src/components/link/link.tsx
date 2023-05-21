import NextLink, { type LinkProps as NextLinkProps } from 'next/link';
import { type AnchorHTMLAttributes } from 'react';

type LinkProps = NextLinkProps & AnchorHTMLAttributes<HTMLAnchorElement>;

export const Link = ({ children, ...props }: LinkProps) => (
    <NextLink
        className="my-8 inline-block cursor-pointer bg-transparent p-0 text-lg text-light-primary hover:underline dark:text-dark-primary"
        {...props}
    >
        {children}
    </NextLink>
);

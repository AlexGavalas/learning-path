import { AnchorHTMLAttributes } from 'react';
import Link from 'next/link';

// Custom link component to use next's Link for internal routing
export const CustomLink = (props: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const { href } = props;

    const isInternalLink =
        href && (href.startsWith('/') || href.startsWith('#'));

    if (isInternalLink) {
        return (
            <Link href={href} {...props}>
                {props.children}
            </Link>
        );
    }

    return <a {...props} />;
};

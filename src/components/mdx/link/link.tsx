import Link from 'next/link';
import { type AnchorHTMLAttributes } from 'react';

// Custom link component to use next's Link for internal routing
export const CustomLink = (props: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const { href } = props;

    if (href) {
        return (
            <Link href={href} {...props}>
                {props.children}
            </Link>
        );
    }

    return <a {...props} />;
};

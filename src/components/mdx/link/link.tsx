// import Link from 'next/link';
import { type AnchorHTMLAttributes } from 'react';

// Custom link component to use next's Link for internal routing
export const CustomLink = (props: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    // const { href } = props;

    // const isInternalLink =
    //     href && (href.startsWith('/') || href.startsWith('#'));

    // TODO: Check with https://github.com/vercel/next.js/pull/49521
    // if (isInternalLink) {
    //     return (
    //         <Link href={href} {...props}>
    //             {props.children}
    //         </Link>
    //     );
    // }

    return <a {...props} />;
};

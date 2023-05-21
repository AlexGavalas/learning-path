import { Link } from '~components/link';

type NavigationProps = {
    links: {
        href: string;
        label: string;
    }[];
};

export const Navigation = ({ links }: NavigationProps) => {
    return (
        <nav className="flex items-center justify-center gap-5 p-4">
            {links.map((link) => (
                <Link key={link.href} href={link.href}>
                    {link.label}
                </Link>
            ))}
        </nav>
    );
};

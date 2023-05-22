import { Link } from '~components/link';

type NavigationProps = {
    links: {
        href: string;
        label: string;
    }[];
};

export const Navigation = ({ links }: NavigationProps) => (
    <nav className="flex items-center justify-center gap-10 p-4 pt-6">
        {links.map((link) => (
            <Link key={link.href} href={link.href} className="my-0">
                {link.label}
            </Link>
        ))}
    </nav>
);

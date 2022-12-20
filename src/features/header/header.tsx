import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Button } from '~components/button';

export const Header = () => {
    const [mounted, setIsMounted] = useState(false);
    const { setTheme, resolvedTheme } = useTheme();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
    };

    const image =
        resolvedTheme === 'light'
            ? {
                  src: '/moon.svg',
                  alt: 'Moon',
              }
            : {
                  src: '/sun.svg',
                  alt: 'Sun',
              };

    return (
        <header className="flex justify-between w-full items-center border-0 border-solid border-b dark:border-b-white">
            <div className="flex">
                <Link
                    href="/"
                    className="cursor-pointer hover:no-underline font-[700] p-2 m-2 text-3xl text-black dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-800"
                >
                    Learning Path
                </Link>
            </div>
            {mounted && (
                <div className="mr-3">
                    <Button onClick={toggleTheme} variant="wrapper">
                        <Image
                            src={image.src}
                            alt={image.alt}
                            width={20}
                            height={20}
                        />
                    </Button>
                </div>
            )}
        </header>
    );
};

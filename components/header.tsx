/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';

import { Button } from './button';

export const Header = () => {
    const [mounted, setIsMounted] = useState(false);
    const { setTheme, resolvedTheme } = useTheme();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
    };

    return (
        <>
            <header className="flex justify-between w-full items-center border-0 border-solid border-b dark:border-b-white">
                <div className="flex">
                    <Link href="/">
                        <a className="cursor-pointer hover:no-underline font-[700] p-2 m-2 text-3xl text-black dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-800">
                            Learning Path
                        </a>
                    </Link>
                </div>
                {mounted && (
                    <div className="mr-3">
                        <Button onClick={toggleTheme} variant="wrapper">
                            {resolvedTheme === 'light' ? (
                                <img
                                    src="/moon.svg"
                                    alt="Moon"
                                    width={20}
                                    height={20}
                                />
                            ) : (
                                <img
                                    src="/sun.svg"
                                    alt="Sun"
                                    width={20}
                                    height={20}
                                />
                            )}
                        </Button>
                    </div>
                )}
            </header>
        </>
    );
};

export default Header;

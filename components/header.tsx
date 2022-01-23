/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';
import { useTheme } from 'next-themes';

import { Button } from './button';

const StyledHeader = styled.header`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-block-end: 1px solid;
    width: 100%;
`;

const LinksContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 0.5rem;
`;

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
        <StyledHeader>
            <LinksContainer>
                <Link href="/">
                    <a className="cursor-pointer hover:no-underline font-[700] p-2 m-2 text-3xl text-black dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-800">
                        Learning Path
                    </a>
                </Link>
            </LinksContainer>
            {mounted && (
                <div className="mr-3">
                    <Button onClick={toggleTheme}>
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
        </StyledHeader>
    );
};

export default Header;

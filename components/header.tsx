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
`;

const LoginContainer = styled.div``;

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
                <Link href="/" passHref>
                    <h1 className="cursor-pointer p-2 text-3xl dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-800">
                        Learning Path
                    </h1>
                </Link>
            </LinksContainer>
            <LoginContainer>
                {mounted && (
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
                )}
            </LoginContainer>
        </StyledHeader>
    );
};

export default Header;

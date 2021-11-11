import Link from 'next/link';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

import { Button } from './button';

const StyledHeader = styled.header`
    height: 5rem;
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

const HorizontalSeparator = styled.span`
    margin-inline: 0.5rem;
`;

const LoginContainer = styled.div``;

const Logo = styled(motion.h1)`
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background-color: #ffffff;
    font-size: clamp(1.5rem, 8vw, 2rem);
`;

export const Header = () => {
    return (
        <StyledHeader>
            <LinksContainer>
                <Link href="/" passHref>
                    <Logo
                        whileHover={{ backgroundColor: '#d7d7d7' }}
                        transition={{ duration: 0.5 }}
                    >
                        Learning Path
                    </Logo>
                </Link>
            </LinksContainer>
            {/* <LoginContainer>
				<Button>Login</Button>
			</LoginContainer> */}
        </StyledHeader>
    );
};

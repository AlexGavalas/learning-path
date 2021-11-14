import { FC } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';

const Container = styled(motion.main)`
    padding-inline: 1rem;
    margin-block: 3rem;
    width: 100%;
`;

const variants = {
    hidden: {
        opacity: 0,
        x: -200,
    },
    enter: {
        opacity: 1,
        x: 0,
    },
};

const Layout: FC = ({ children }) => {
    return (
        <Container
            initial="hidden"
            animate="enter"
            exit="hidden"
            variants={variants}
            transition={{ type: 'linear' }}
        >
            {children}
        </Container>
    );
};

export default Layout;

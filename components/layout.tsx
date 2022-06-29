import type { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';

const variants = {
    hidden: {
        opacity: 0,
    },
    enter: {
        opacity: 1,
    },
};

const Layout: FC<{ children?: ReactNode }> = ({ children }) => {
    return (
        <motion.main
            initial="hidden"
            animate="enter"
            exit="hidden"
            variants={variants}
            transition={{ type: 'linear' }}
            className="px-2 mt-4"
        >
            {children}
        </motion.main>
    );
};

export default Layout;

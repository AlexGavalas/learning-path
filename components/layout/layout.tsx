import type { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';

import { variants } from './constants';

export const Layout: FC<{ children?: ReactNode }> = ({ children }) => (
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

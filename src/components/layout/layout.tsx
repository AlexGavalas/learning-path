'use client';

import { motion } from 'framer-motion';
import { type FC, type ReactNode } from 'react';

import { variants } from './constants';

export const Layout: FC<{ children?: ReactNode }> = ({ children }) => (
    <motion.main
        initial="hidden"
        animate="enter"
        exit="hidden"
        variants={variants}
        transition={{ type: 'linear' }}
        className="mt-4 px-2"
    >
        {children}
    </motion.main>
);

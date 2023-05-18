'use client';

import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

export const Providers = ({ children }: { children: ReactNode }) => (
    <ThemeProvider attribute="class">{children}</ThemeProvider>
);

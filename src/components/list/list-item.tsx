import { type FC, type ReactNode } from 'react';

export const ListItem: FC<{ children?: ReactNode }> = ({ children }) => (
    <li className="marker:text-light-primary dark:marker:text-dark-primary list-disc text-[0.9em]">
        {children}
    </li>
);

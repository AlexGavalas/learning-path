import type { FC, ReactNode } from 'react';

export const ListItem: FC<{ children?: ReactNode }> = ({ children }) => (
    <li className="marker:text-teal-500 dark:marker:text-yellow-500 list-disc">
        {children}
    </li>
);

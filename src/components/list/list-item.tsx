import { type FC, type ReactNode } from 'react';

export const ListItem: FC<{ children?: ReactNode }> = ({ children }) => (
    <li className="list-disc text-[0.9em] marker:text-teal-500 dark:marker:text-yellow-500">
        {children}
    </li>
);

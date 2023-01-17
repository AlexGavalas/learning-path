import { type FC, type ReactNode } from 'react';

export const ListItem: FC<{ children?: ReactNode }> = ({ children }) => (
    <li className="list-disc text-[0.9em] marker:text-light-primary dark:marker:text-dark-primary">
        {children}
    </li>
);

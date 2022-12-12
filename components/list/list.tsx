import type { FC, ReactNode } from 'react';

export const List: FC<{ children?: ReactNode }> = ({ children }) => (
    <ul className="pb-4">{children}</ul>
);
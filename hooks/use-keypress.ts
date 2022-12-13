import { useEffect } from 'react';

export const useKeypress = (
    key: string,
    handler: (e: KeyboardEvent) => void,
) => {
    useEffect(() => {
        const handlePress = (e: KeyboardEvent) => {
            if (e.key === key) {
                handler(e);
            }
        };

        document.addEventListener('keyup', handlePress);

        return () => {
            document.removeEventListener('keyup', handlePress);
        };
    }, [key, handler]);
};

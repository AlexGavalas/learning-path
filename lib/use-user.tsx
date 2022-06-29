import {
    FC,
    ReactNode,
    useEffect,
    useState,
    createContext,
    useContext,
} from 'react';

import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';

import { supabase } from './supabase';

type UserContextType = {
    user: User | null;
    userLoaded: boolean;
};

export const UserContext = createContext<UserContextType | undefined>(
    undefined
);

const handleAuthChange = async (
    event: AuthChangeEvent,
    session: Session | null
) => {
    await fetch('/api/auth', {
        body: JSON.stringify({ event, session }),
        credentials: 'same-origin',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        method: 'POST',
    });
};

export const UserContextProvider: FC<{ children?: ReactNode }> = ({
    children,
}) => {
    const [userLoaded, setUserLoaded] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const session = supabase.auth.session();

        setUser(session?.user ?? null);
        setUserLoaded(true);

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                handleAuthChange(event, session);
                setUser(session?.user ?? null);
            }
        );

        return () => {
            authListener?.unsubscribe();
        };
    }, []);

    const value = {
        user,
        userLoaded,
    };

    return (
        <UserContext.Provider value={value}>{children}</UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);

    if (context === undefined) {
        throw new Error(`useUser must be used within a UserContextProvider.`);
    }

    return context;
};

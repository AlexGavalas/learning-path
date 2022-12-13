import {
    FC,
    ReactNode,
    useEffect,
    useState,
    useContext,
    createContext,
} from 'react';

import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';

import { supabase } from '~lib/supabase';

type UserContextType = {
    user: User | null;
    userLoaded: boolean;
};

export const UserContext = createContext<UserContextType | null>(null);

const handleAuthChange = async (
    event: AuthChangeEvent,
    session: Session | null,
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
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setUserLoaded(true);
        });

        const {
            data: { subscription: authListener },
        } = supabase.auth.onAuthStateChange((event, session) => {
            handleAuthChange(event, session);
            setUser(session?.user ?? null);
        });

        return () => {
            authListener.unsubscribe();
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

    if (!context) {
        throw new Error(`useUser must be used within a UserContextProvider.`);
    }

    return context;
};

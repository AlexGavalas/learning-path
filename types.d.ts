namespace NodeJS {
    interface ProcessEnv {
        NEXT_PUBLIC_SUPABASE_URL: string;
        NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
        NEXT_PUBLIC_FAUNA_SECRET: string;
    }
}

interface Post {
    id: string;
    post: string;
    name: string;
    ts: number;
}

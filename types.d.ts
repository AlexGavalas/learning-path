namespace NodeJS {
    interface ProcessEnv {
        NEXT_PUBLIC_SUPABASE_URL: string;
        NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    }
}

interface Post {
    id: string;
    created_at: string;
    post: string;
    name: string;
}

namespace NodeJS {
    interface ProcessEnv {
        NEXT_PUBLIC_SUPABASE_URL: string;
        NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    }
}

interface PostContent {
    post: string;
    name: string;
}

interface Post {
    data: PostContent;
    key: string;
}

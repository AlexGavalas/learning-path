declare namespace NodeJS {
    interface ProcessEnv {
        NEXT_PUBLIC_SUPABASE_URL: string;
        NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
        REVALIDATE_SECRET: string;
        FILE_SERVER_URL: string;
    }
}

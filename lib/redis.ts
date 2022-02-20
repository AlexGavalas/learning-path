import upstash from '@upstash/redis';

export const redis = upstash(
    process.env.NEXT_PUBLIC_UPSTASH_REDIS_URL,
    process.env.NEXT_PUBLIC_UPSTASH_REDIS_TOKEN
);

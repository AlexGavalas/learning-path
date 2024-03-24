import { createClient } from '@vercel/edge-config';

export const edgeConfig = createClient(process.env.PUBLIC_EDGE_CONFIG);

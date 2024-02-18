// import Database from 'better-sqlite3';
// import path from 'node:path';
// import { logger } from '../../scripts/logger';
// const dbPath = path.join(process.cwd(), 'database', 'notes-db.sqlite3');
// export const db = new Database(dbPath, {
//     verbose: logger.debug,
// });
import { PrismaClient } from '@prisma/client';

export const db = new PrismaClient();

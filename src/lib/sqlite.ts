import Database from 'better-sqlite3';

import { logger } from '../../scripts/logger';

export const db = new Database('notes-db.sqlite3', {
    verbose: logger.debug,
});

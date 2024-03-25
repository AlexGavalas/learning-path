import 'dotenv/config';

import { logger } from './logger';
import { updateMdTimestamps } from './update-md-timestamps';

updateMdTimestamps(process.argv.slice(2)).catch((e: unknown) => {
    logger.error(e);
});

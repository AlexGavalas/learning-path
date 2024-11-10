import 'dotenv/config';

import { logger } from './logger';
import { updateMdTimestamps } from './update-md-timestamps';

const FILES_START_INDEX = 2;

updateMdTimestamps(process.argv.slice(FILES_START_INDEX)).catch((error) => {
    logger.error(error);
});

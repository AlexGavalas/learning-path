import { indexSummaries } from './index-summaries';
import { logger } from './logger';

indexSummaries().catch((error: unknown) => {
    logger.error(error);
});

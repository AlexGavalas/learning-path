import { indexLessonSummaries } from './index-lesson-summaries';
import { logger } from './logger';

indexLessonSummaries().catch((error: unknown) => {
    logger.error(error);
});

import { indexLessonSummaries } from './index-lesson-summaries';
import { logger } from './logger';

indexLessonSummaries().catch((e) => {
    logger.error(e);
});

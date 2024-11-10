import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
    format: format.combine(format.timestamp(), format.prettyPrint()),
    level: 'silly',
    silent: process.env.NODE_ENV === 'test',
    transports: [new transports.Console()],
});

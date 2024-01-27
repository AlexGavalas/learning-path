import { createLogger, format, transports } from 'winston';

const formatPretty = format.printf(
    ({ level, message, timestamp }) => `${timestamp} [${level}]: ${message}`,
);

export const logger = createLogger({
    format: format.combine(format.colorize(), format.timestamp(), formatPretty),
    level: 'silly',
    silent: process.env.NODE_ENV === 'test',
    transports: [new transports.Console()],
});

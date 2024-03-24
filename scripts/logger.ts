import { createLogger, format, transports } from 'winston';

type FormatPrettyParams = Parameters<Parameters<typeof format.printf>[0]>[0] & {
    durationMs?: number;
};

const formatPretty = format.printf(
    ({ level, message, timestamp, durationMs }: FormatPrettyParams) =>
        `${timestamp} [${level}]: ${message} ${typeof durationMs === 'number' ? `(${durationMs}ms)` : ''}`,
);

export const logger = createLogger({
    format: format.combine(format.colorize(), format.timestamp(), formatPretty),
    level: 'silly',
    silent: process.env.NODE_ENV === 'test',
    transports: [new transports.Console()],
});

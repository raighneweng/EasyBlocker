import winston from 'winston';

// winston config
const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        debug: 4,
    },
    colors: {
        fatal: 'magenta',
        error: 'red',
        warn: 'yellow',
        info: 'green',
        debug: 'cyan',
    },
};

winston.addColors(customLevels.colors);

const { combine, colorize, timestamp, label, printf } = winston.format;

const customFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const loggingLevel = process.env.LOGGING_LEVEL;
const loggingPath = process.env.LOGGING_FILE_PATH;

export const winstonLogger = winston.createLogger({
    level: loggingLevel,
    levels: customLevels.levels,
    format: combine(colorize(), label({ label: 'PAYMENT-API' }), timestamp(), customFormat),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            level: 'fatal',
            dirname: loggingPath,
            filename: 'error.log',
        }),
        new winston.transports.File({
            level: 'error',
            dirname: loggingPath,
            filename: 'error.log',
        }),
        new winston.transports.File({ level: 'warn', dirname: loggingPath, filename: 'info.log' }),
        new winston.transports.File({ level: 'info', dirname: loggingPath, filename: 'info.log' }),
        new winston.transports.File({ level: 'debug', dirname: loggingPath, filename: 'info.log' }),
        new winston.transports.File({ dirname: loggingPath, filename: 'server.log' }),
    ],
    exceptionHandlers: [
        new winston.transports.File({ dirname: loggingPath, filename: 'exceptions.log' }),
    ],
    exitOnError: false,
});

// logger
const logger = {
    fatal: (requestId: string, message: string) => {
        winstonLogger.log({
            level: 'fatal',
            message: `${requestId}${requestId ? ' ' : ''}${message}`,
        });
    },
    error: (requestId: string, message: string) => {
        winstonLogger.log({
            level: 'error',
            message: `${requestId}${requestId ? ' ' : ''}${message}`,
        });
    },
    warn: (requestId: string, message: string) => {
        winstonLogger.log({
            level: 'warn',
            message: `${requestId}${requestId ? ' ' : ''}${message}`,
        });
    },
    info: (requestId: string, message: string) => {
        winstonLogger.log({
            level: 'info',
            message: `${requestId}${requestId ? ' ' : ''}${message}`,
        });
    },
    debug: (requestId: string, message: string) => {
        winstonLogger.log({
            level: 'debug',
            message: `${requestId}${requestId ? ' ' : ''}${message}`,
        });
    },
};

export default logger;

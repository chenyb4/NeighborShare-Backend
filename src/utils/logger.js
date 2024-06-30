// logger.js
const { createLogger, format, transports } = require('winston');
const { MongoDB } = require('winston-mongodb');

const logger = createLogger({
    level: 'error', // Set the default log level
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    transports: [
        // Log errors to a MongoDB collection
        new MongoDB({
            level: 'error',
            db: process.env.DB_CONNECTION,
            collection: 'error_logs',
            tryReconnect: true,
            options: { useUnifiedTopology: true }
        }),
        // Optionally log to a file
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        // Optionally log to the console if not in production
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.simple()
            ),
            level: process.env.NODE_ENV !== 'production' ? 'debug' : 'error'
        })
    ],
});

module.exports = logger;

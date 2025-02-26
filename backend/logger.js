const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Define log directory path
const logDirectory = path.join(__dirname, '../logs');

// Ensure logs directory exists
try {
    if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory, { recursive: true });
    }
} catch (error) {
    console.error("Error creating logs directory:", error);
}

// Create logger instance
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.File({ filename: path.join(logDirectory, 'server.log'), level: 'info' }),
        new winston.transports.File({ filename: path.join(logDirectory, 'error.log'), level: 'error' }),
        new winston.transports.Console()
    ]
});

module.exports = logger;

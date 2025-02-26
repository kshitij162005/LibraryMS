const winston = require('winston');
const path = require('path');
require('dotenv').config(); // Load environment variables

// Get log file path from .env or use default
const logFilePath = process.env.LOG_FILE_PATH || path.join(__dirname, 'logs', 'app.log');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: logFilePath }),
    new winston.transports.Console(),
  ],
});

module.exports = logger;

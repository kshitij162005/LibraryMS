const logToFile = async (level, message) => {
  try {
    const response = await fetch('http://localhost:3001/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ level, message }),
    });

    if (!response.ok) {
      console.error('Failed to send log to backend:', await response.text());
    }
  } catch (error) {
    console.error('Error sending log to backend:', error);
  }
};

const logger = {
  info: (message) => {
    console.info(`[INFO]: ${message}`);
    logToFile('info', message);
  },
  warn: (message) => {
    console.warn(`[WARN]: ${message}`);
    logToFile('warn', message);
  },
  error: (message) => {
    console.error(`[ERROR]: ${message}`);
    logToFile('error', message);
  },
};

export default logger;

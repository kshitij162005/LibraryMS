const express = require('express');
const cors = require('cors');
const logger = require('./logger');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  logger.info('Root API accessed');
  res.send('Server is running!');
});

app.post('/add-member', (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email) {
    logger.error('Missing required fields');
    return res.status(400).json({ error: 'Name and email are required' });
  }

  logger.info(`Member added: ${name}, ${email}, ${phone}`);
  res.status(201).json({ message: 'Member added successfully' });
});

app.post('/log', (req, res) => {
    const { level, message } = req.body;
    if (!level || !message) {
      return res.status(400).json({ error: 'Level and message are required' });
    }
  
    logger[level](message);
    res.status(200).json({ message: 'Log recorded' });
  });
  

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
});

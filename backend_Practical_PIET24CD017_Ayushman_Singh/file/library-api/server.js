require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');

const logger = require('./middleware/logger');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const bookRoutes = require('./routes/books');

const app = express();

app.use(express.json());
app.use(logger);

app.get('/', (req, res) => res.send('Library API is running'));
app.use('/books', bookRoutes);

app.use(notFound);
app.use(errorHandler);

async function start() {
  const PORT = process.env.PORT || 3000;
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');
    return app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

if (require.main === module) start();

module.exports = { app, start };

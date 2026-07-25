// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const initDb = require('./config/initDb');

const authRoutes = require('./routes/authRoutes');
const habitRoutes = require('./routes/habitRoutes');
const adminRoutes = require('./routes/adminRoutes');
const quoteRoutes = require('./routes/quoteRoutes');

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/quotes', quoteRoutes);

app.get('/', (req, res) => res.json({ message: 'DailyDost API is running' }));

const PORT = process.env.PORT || 5000;

initDb()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });

    // Graceful shutdown: close mysql pool then exit
    async function shutdown() {
      console.log('Shutting down gracefully...');
      try {
        await pool.end();
        console.log('DB pool closed.');
      } catch (err) {
        console.error('Error closing DB pool:', err);
      } finally {
        process.exit(0);
      }
    }

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  })
  .catch((err) => {
    console.error('Failed to initialize database. Server not started.', err);
    process.exit(1);
  });
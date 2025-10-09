// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config/db');

// Models
const User = require('./models/userModel');
const Habit = require('./models/habitModel');
const HabitLog = require('./models/logModel');

// Routes
const userRoutes = require('./routes/userRoutes');
const habitRoutes = require('./routes/habitRoutes');
const logRoutes = require('./routes/logRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/logs', logRoutes);

// Test route
app.get('/', (req, res) => res.send('DailyDost API is running!'));

// Sync Database
sequelize.sync({ alter: true })
  .then(() => console.log('✅ Tables synced successfully!'))
  .catch(err => console.log('❌ Sync error: ', err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
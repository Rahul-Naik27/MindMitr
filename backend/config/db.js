// config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'dailydost',
  waitForConnections: true,
  connectionLimit: 5, // IMPORTANT: max 5 simultaneous connections
  queueLimit: 0
});

module.exports = pool;
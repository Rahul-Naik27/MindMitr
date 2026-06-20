const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'R@hul@2704',
  database: process.env.DB_NAME || 'dailydost',
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
});

module.exports = pool;
const pool = require('./db');

async function initDb() {
  const conn = await pool.getConnection();
  try {
    console.log('Initializing database tables...');

    // 1. Users table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Migration: rename 'username' column to 'name' if it exists
    const [columns] = await conn.execute(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'username'
    `);
    if (columns.length > 0) {
      await conn.execute(`ALTER TABLE users CHANGE username name VARCHAR(100) NOT NULL`);
      console.log('✅ Migrated: renamed column username → name in users table.');
    }

    // 2. Habits table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS habits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        frequency VARCHAR(50),
        goal_duration INT,
        start_date DATE,
        end_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 3. Habit completions table (correct name & schema matching completionModel.js)
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS habit_completions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        habit_id INT NOT NULL,
        user_id INT NOT NULL,
        date DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'done',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_completion (habit_id, user_id, date),
        FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Database tables ready.');
  } catch (err) {
    console.error('❌ Error initializing database:', err);
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = initDb;

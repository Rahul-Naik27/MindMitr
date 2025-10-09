const express = require('express');
const router = express.Router();
const HabitLog = require('../models/logModel');
const Habit = require('../models/habitModel');

// POST /api/logs/mark
router.post('/mark', async (req, res) => {
  const { habit_id, log_date, status } = req.body;

  if(!habit_id || !log_date || !status) {
    return res.status(400).json({ message: 'Provide habit_id, log_date and status' });
  }

  try {
    // Check if log already exists for this date
    let log = await HabitLog.findOne({ where: { habitId: habit_id, log_date } });

    if(log) {
      // Update status
      log.status = status;
      await log.save();
    } else {
      // Create new log
      log = await HabitLog.create({ habitId: habit_id, log_date, status });
    }

    res.status(200).json({ message: 'Habit log updated', log });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
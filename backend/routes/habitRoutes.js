const express = require('express');
const router = express.Router();
const Habit = require('../models/habitModel');

// POST /api/habits/add
router.post('/add', async (req, res) => {
  const { user_id, title, frequency, description } = req.body;

  if(!user_id || !title) {
    return res.status(400).json({ message: 'Please provide user ID and title' });
  }

  try {
    const habit = await Habit.create({
      userId: user_id,
      title,
      frequency: frequency || 'daily',
      description: description || ''
    });
    res.status(201).json({ message: 'Habit added', habit });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/habits/:userId
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const habits = await Habit.findAll({ where: { userId } });
    res.status(200).json(habits);
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
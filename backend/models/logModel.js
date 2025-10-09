const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Habit = require('./habitModel');

const HabitLog = sequelize.define('HabitLog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'pending' } // 'completed' or 'pending'
});

Habit.hasMany(HabitLog, { onDelete: 'CASCADE' });
HabitLog.belongsTo(Habit);

module.exports = HabitLog;
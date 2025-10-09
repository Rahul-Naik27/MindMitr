const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./userModel');

const Habit = sequelize.define('Habit', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  frequency: { type: DataTypes.STRING, defaultValue: 'daily' },
  startDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

User.hasMany(Habit, { onDelete: 'CASCADE' });
Habit.belongsTo(User);

module.exports = Habit;

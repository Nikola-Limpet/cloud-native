const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/supabase');

const Employee = sequelize.define('Employee', {
  empid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING
  },
  emailid: {
    type: DataTypes.STRING
  },
  pass: {
    type: DataTypes.STRING
  },
  salary: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true
});

module.exports = Employee;
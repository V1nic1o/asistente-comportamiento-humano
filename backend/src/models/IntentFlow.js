const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const IntentFlow = sequelize.define('IntentFlow', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  fromIntent: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  toIntent: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

module.exports = IntentFlow;

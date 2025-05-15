// src/models/UnknownPhrase.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UnknownPhrase = sequelize.define('UnknownPhrase', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  phrase: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  explanation: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  intentSuggested: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

module.exports = UnknownPhrase;

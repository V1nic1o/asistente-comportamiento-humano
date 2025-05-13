// src/models/ChatSession.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChatSession = sequelize.define('ChatSession', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  context: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {}
  },
  
  nextExpectedIntent: {
    type: DataTypes.STRING,
    allowNull: true
  }
  
});

module.exports = ChatSession;

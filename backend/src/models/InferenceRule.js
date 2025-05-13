// src/models/InferenceRule.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InferenceRule = sequelize.define('InferenceRule', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  conditions: {
    type: DataTypes.JSONB, // arreglo dinámico de condiciones
    allowNull: false,
  },
  respuesta: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = InferenceRule;

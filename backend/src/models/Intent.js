const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Intent = sequelize.define('Intent', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tag: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phrases: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: false,
    defaultValue: [],
  },
  response: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: true,
    defaultValue: [],
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['informativa', 'conversacional', 'solicitud', 'aclaracion', 'aprendizaje']]
    }
  }
});

module.exports = Intent;

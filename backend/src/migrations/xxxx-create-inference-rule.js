'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('InferenceRules', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      intencion: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      emocion: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      detalle: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      respuesta: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('InferenceRules');
  }
};

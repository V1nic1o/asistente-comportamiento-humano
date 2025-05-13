'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Eliminar columna actual
    await queryInterface.removeColumn('Intents', 'response');

    // 2. Agregar columna con tipo ARRAY(TEXT)
    await queryInterface.addColumn('Intents', 'response', {
      type: Sequelize.ARRAY(Sequelize.TEXT),
      allowNull: true,
      defaultValue: [],
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revertir al tipo TEXT original
    await queryInterface.removeColumn('Intents', 'response');

    await queryInterface.addColumn('Intents', 'response', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    });
  },
};

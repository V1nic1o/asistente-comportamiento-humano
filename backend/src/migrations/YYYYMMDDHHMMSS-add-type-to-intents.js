'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Intents', 'type', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'flujo' // puedes cambiarlo a 'emocional' si prefieres otro default
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Intents', 'type');
  }
};

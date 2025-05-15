'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Intents', 'type', {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isIn: [['informativa', 'conversacional', 'solicitud', 'aclaracion', 'aprendizaje']],
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Intents', 'type', {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isIn: [['emocional', 'contextual', 'necesidad', 'flujo']],
      },
    });
  },
};

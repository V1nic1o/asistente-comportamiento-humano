'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UnknownPhrases', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        allowNull: false,
        primaryKey: true,
      },
      phrase: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      sessionId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      explanation: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      intentSuggested: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('UnknownPhrases');
  }
};

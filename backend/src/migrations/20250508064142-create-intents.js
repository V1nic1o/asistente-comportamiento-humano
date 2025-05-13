'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Intents', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
        allowNull: false,
      },
      tag: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      phrases: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        allowNull: false,
        defaultValue: [],
      },
      response: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
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
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Intents');
  },
};

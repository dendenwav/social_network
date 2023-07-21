'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MessageSelectedFiles', {
      id_selected_file: {
        type: Sequelize.INTEGER,
        references: {
          model: 'SelectedFiles',
          key: 'id'
        }
      },
      id_message: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Messages',
          key: 'id'
        }
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('MessageSelectedFiles');
  }
};
'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Attachments', 
      { 
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
          unique: true
        },
        createdAt: {
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE
        },
        mime: {
            type: DataTypes.STRING,
            allowNull: true
        },
        url: {
            type: DataTypes.STRING,
            allowNull: true
        },
        image: {
            type: DataTypes.BLOB('long'),
            allowNull: true
        }
      },
      {
        sync: {force: true}
      }); 
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Attachments');
  }
};

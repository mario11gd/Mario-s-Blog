'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Posts', 
      [
        {
          title: 'Primer Post',
          body: 'Esta práctica imprementa un Blog.',
          attachmentId: 1
        },
        {
          title: 'Segundo Post',
          body: 'Todo el mundo puede crear posts.',
          attachmentId: 2
        },
        {
          title: 'Tercer Post',
          body: 'Cada post puede tener una imagen adjunta.',
          attachmentId: 3
        }
      ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Posts', null, {});
  }
};

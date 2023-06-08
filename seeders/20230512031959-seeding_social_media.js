'use strict';

const dataSocialMedia =  [
  {
    name: "social media 1",
    social_media_url: "socialmedia.com",
    createdAt: new Date(),
    updatedAt: new Date(),
    UserId: 3
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert("SocialMedia", dataSocialMedia, {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("SocialMedia", null, {})
  }
};

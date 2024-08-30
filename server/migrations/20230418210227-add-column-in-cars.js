'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'cars',
            'compressed_image_url', {
                type: Sequelize.STRING,
            }
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn(
            'cars',
            'compressed_image_url',
        );
    }
};

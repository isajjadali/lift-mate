'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'users',
            'is_created_at_reservation', {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            }
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn(
            'users',
            'is_created_at_reservation',
        );
    }
};

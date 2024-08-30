'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('reservation_details', 'is_paid', {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('reservation_details', 'is_paid');
    },
};

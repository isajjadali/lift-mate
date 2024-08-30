'use strict';

module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.removeColumn(
            'reservations',
            'service'
        );       

    },
    down: function(queryInterface, Sequelize) {
       
        return queryInterface.addColumn(
            'reservations',
            'service',
            Sequelize.STRING
        );
    }
};

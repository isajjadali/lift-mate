'use strict';

module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.addColumn(
            'reservations',
            'assigned_drivers',
            Sequelize.STRING
        );  
    },
    down: function(queryInterface, Sequelize) {
        return queryInterface.removeColumn(
            'reservations',
            'assigned_drivers'
        );       
    }
};



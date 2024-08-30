'use strict';

module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.addColumn(
            'reservations',
            'is_bags_checked',
            Sequelize.BOOLEAN
        );  
    },
    down: function(queryInterface, Sequelize) {
        return queryInterface.removeColumn(
            'reservations',
            'is_bags_checked'
        );       

        
    }
};

'use strict';

module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.addColumn(
            'users',
            'phone_type',
            Sequelize.STRING
        );  
    },
    down: function(queryInterface, Sequelize) {
        return queryInterface.removeColumn(
            'users',
            'phone_type'
        );       

        
    }
};

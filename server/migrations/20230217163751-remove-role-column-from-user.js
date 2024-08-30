'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn('users', 'role');
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.addColumn('users', 'role', Sequelize.STRING);
    },
};

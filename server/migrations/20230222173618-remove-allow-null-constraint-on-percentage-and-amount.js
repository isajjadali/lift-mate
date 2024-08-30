'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        const { FLOAT } = Sequelize.DataTypes;
        return Promise.all([
            queryInterface.changeColumn('addons', 'amount', {
                type: FLOAT,
                allowNull: true,
            }),
            queryInterface.changeColumn('addons', 'percentage', {
                type: FLOAT,
                allowNull: true,
            }),
            queryInterface.changeColumn('surges', 'amount', {
                type: FLOAT,
                allowNull: true,
            }),
            queryInterface.changeColumn('surges', 'percentage', {
                type: FLOAT,
                allowNull: true,
            }),
        ]);
    },
    down: function (queryInterface, Sequelize) {
        const { FLOAT } = Sequelize.DataTypes;
        return Promise.all([
            queryInterface.changeColumn('addons', 'amount', {
                type: FLOAT,
                allowNull: false,
            }),
            queryInterface.changeColumn('addons', 'percentage', {
                type: FLOAT,
                allowNull: false,
            }),
            queryInterface.changeColumn('surges', 'amount', {
                type: FLOAT,
                allowNull: false,
            }),
            queryInterface.changeColumn('surges', 'percentage', {
                type: FLOAT,
                allowNull: false,
            }),
        ]);
    },
};

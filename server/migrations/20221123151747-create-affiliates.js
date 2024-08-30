'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { DATE, INTEGER, STRING } = Sequelize.DataTypes;
        return queryInterface.createTable('affiliates', {
            // Below Keys must be in all migrations
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: INTEGER,
            },
            created_at: {
                allowNull: false,
                type: DATE,
            },
            updated_at: {
                allowNull: false,
                type: DATE,
            },
            deleted_at: {
                type: DATE,
            },
            // Above Keys must be in all migrations
            name: {
                type: STRING,
                allowNull: false,
            },
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('affiliates');
    },
};

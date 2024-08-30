'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { DATE, INTEGER, STRING, BOOLEAN, FLOAT } = Sequelize.DataTypes;
        return queryInterface.createTable('addons', {
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
                unique: true,
            },
            amount: {
                type: FLOAT,
                allowNull: false,
            },
            percentage: {
                type: FLOAT,
                allowNull: false,
            },
            is_active: {
                type: BOOLEAN,
                defaultValue: true,
            },
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('addons');
    },
};

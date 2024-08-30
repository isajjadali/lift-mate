'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { DATE, INTEGER, STRING, BOOLEAN, FLOAT, TEXT } =
          Sequelize.DataTypes;
        return queryInterface.createTable('surges', {
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
            description: {
                type: TEXT,
                allowNull: false,
            },
            from: {
                type: STRING,
                allowNull: false,
            },
            to: {
                type: STRING,
                allowNull: false,
            },
            percentage: {
                type: FLOAT,
                allowNull: false,
            },
            amount: {
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
        return queryInterface.dropTable('surges');
    },
};

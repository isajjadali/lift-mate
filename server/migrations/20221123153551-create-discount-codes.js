'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { DATE, INTEGER, STRING, FLOAT, BOOLEAN } = Sequelize.DataTypes;
        return queryInterface.createTable('discount_codes', {
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
            code: {
                type: STRING,
                allowNull: false,
            },
            type: {
                type: STRING,
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
            },
            amount: {
                type: FLOAT,
            },
            is_active: {
                type: BOOLEAN,
                defaultValue: true,
            },
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('discount_codes');
    },
};

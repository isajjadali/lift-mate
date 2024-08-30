'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { DATE, INTEGER, STRING, FLOAT, BOOLEAN } = Sequelize.DataTypes;
        return queryInterface.createTable('cars', {
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
            to_multiply: {
                type: FLOAT,
                allowNull: false,
            },
            image_url: {
                type: STRING,
            },
            aws_object_key: {
                type: STRING,
            },
            to_add: {
                type: FLOAT,
                allowNull: false,
            },
            is_active: {
                type: BOOLEAN,
                defaultValue: true,
            },
            minimum_rate: {
                type: FLOAT,
                allowNull: false,
            },
            quantity: {
                type: INTEGER,
                defaultValue: 1,
            },
            max_passenger: {
                type: INTEGER,
            },
            max_bags: {
                type: INTEGER,
            },
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('cars');
    },
};

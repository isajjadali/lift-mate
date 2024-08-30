'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { DATE, INTEGER, FLOAT, STRING, BOOLEAN } = Sequelize.DataTypes;
        return queryInterface.createTable('reservation_details', {
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
            reservation_id: {
                type: INTEGER,
                allowNull: false,
                references: {
                    model: 'reservations',
                    key: 'id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
            },
            car_id: {
                type: INTEGER,
                allowNull: false,
                references: {
                    model: 'cars',
                    key: 'id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
            },
            price: {
                type: FLOAT,
            },
            driver_id: {
                type: INTEGER,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
            },
            description: {
                type: STRING,
            },
            name: {
                type: STRING,
            },
            to_multiply: {
                type: FLOAT,
            },
            to_add: {
                type: FLOAT,
            },
            image_url: {
                type: STRING,
            },
            is_active: {
                type: BOOLEAN,
            },
            aws_object_key: {
                type: STRING,
            },
            minimum_rate: {
                type: FLOAT,
            },
            quantity: {
                type: INTEGER,
            },
            max_passenger: {
                type: INTEGER,
            },
            max_bags: {
                type: INTEGER,
            },
            required_cars: {
                type: INTEGER,
            },
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('reservation_details');
    },
};

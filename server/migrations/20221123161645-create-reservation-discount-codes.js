'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { DATE, INTEGER, FLOAT, STRING } = Sequelize.DataTypes;
        return queryInterface.createTable('reservation_discount_codes', {
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
            reservation_id: {
                type: INTEGER,
                references: {
                    model: 'reservations',
                    key: 'id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
            },
            percentage: {
                type: FLOAT,
            },
            amount: {
                type: FLOAT,
            },
            type: {
                type: STRING,
            },
            code: {
                type: STRING,
            },
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('reservation_discount_codes');
    },
};

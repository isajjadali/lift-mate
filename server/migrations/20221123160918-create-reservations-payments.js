'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { DATE, INTEGER, TEXT, STRING } = Sequelize.DataTypes;
        return queryInterface.createTable('reservations_payments', {
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
                references: {
                    model: 'reservations',
                    key: 'id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
            },
            detail: {
                type: TEXT,
            },
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('reservations_payments');
    },
};

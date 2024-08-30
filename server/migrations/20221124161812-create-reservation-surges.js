'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { DATE, INTEGER, STRING, FLOAT, TEXT } = Sequelize.DataTypes;
        return queryInterface.createTable('reservation_surges', {
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
                allowNull: false,
                references: {
                    model: 'reservations',
                    key: 'id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
            },
            name: {
                type: STRING,
                allowNull: false,
            },
            description: {
                type: TEXT,
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
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('reservation_surges');
    },
};

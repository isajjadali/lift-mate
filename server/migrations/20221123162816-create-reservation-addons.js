'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { DATE, INTEGER, FLOAT, STRING } = Sequelize.DataTypes;
        return queryInterface.createTable('reservation_addons', {
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
            name: {
                type: STRING,
                allowNull: false,
            },
            percentage: {
                type: INTEGER,
            },
            amount: {
                type: FLOAT,
            },
            comments: {
                type: STRING,
            },
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('reservation_addons');
    },
};

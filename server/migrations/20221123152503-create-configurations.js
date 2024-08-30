'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { DATE, INTEGER, TEXT } = Sequelize.DataTypes;
        return queryInterface.createTable('configurations', {
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
            configs: {
                type: TEXT,
            },
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('configurations');
    },
};

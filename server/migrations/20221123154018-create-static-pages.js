'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { DATE, INTEGER, STRING, TEXT, BOOLEAN } = Sequelize.DataTypes;
        return queryInterface.createTable('static_pages', {
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
            title: {
                type: STRING,
                allowNull: false,
            },
            content: {
                type: TEXT,
                allowNull: false,
            },
            is_active: {
                type: BOOLEAN,
                defaultValue: false,
            },
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('static_pages');
    },
};

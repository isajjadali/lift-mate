'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { DATE, INTEGER, STRING, ENUM } = Sequelize.DataTypes;
        return queryInterface.createTable('user_attachments', {
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
            user_id: {
                type: INTEGER,
                references: {
                    model: 'users',
                    key: 'id',
                },
                allowNull: false,
                onUpdate: 'cascade',
                onDelete: 'cascade',
            },
            type: {
                type: STRING,
                allowNull: false,
            },
            image_url: {
                type: STRING,
                allowNull: false,
            },
            key: {
                type: STRING,
                allowNull: false,
            },
            expires_on: {
                type: DATE,
                allowNull: false,
            },
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('user_attachments');
    },
};

'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { DATE, INTEGER, STRING } = Sequelize.DataTypes;
        return queryInterface.createTable('user_roles', {
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
            user_id: {
                type: INTEGER,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
            },
            role_id: {
                type: INTEGER,
                references: {
                    model: 'roles',
                    key: 'id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
            },
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('user_roles');
    },
};

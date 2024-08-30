'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { DATE, INTEGER, STRING } = Sequelize.DataTypes;
        return queryInterface.createTable('role_permissions', {
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
            permission_id: {
                type: INTEGER,
                references: {
                    model: 'permissions',
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
        return queryInterface.dropTable('role_permissions');
    },
};

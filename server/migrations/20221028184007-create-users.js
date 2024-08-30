'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { DATE, INTEGER, STRING } = Sequelize.DataTypes;
        return queryInterface.createTable('users', {
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

            first_name: {
                type: STRING,
                allowNull: false,
            },
            last_name: {
                type: STRING,
            },
            email: {
                type: STRING,
                allowNull: false,
            },
            password: {
                type: STRING,
                allowNull: false,
            },
            token: {
                type: STRING,
            },
            temp_email: {
                type: STRING,
            },
            phone_number: {
                type: STRING,
            },
            social_security_number: {
                type: STRING,
            },
            dob: {
                type: STRING,
            },
            address: {
                type: STRING,
            },
            role: {
                type: STRING,
                allowNull: false,
            },
            image: {
                type: STRING,
            },
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('users');
    },
};

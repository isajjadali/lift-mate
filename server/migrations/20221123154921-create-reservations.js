'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { DATE, INTEGER, STRING, BOOLEAN, DECIMAL, TEXT, FLOAT } =
      Sequelize.DataTypes;
        return queryInterface.createTable('reservations', {
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
                onUpdate: 'cascade',
                onDelete: 'cascade',
            },
            affiliate_id: {
                type: INTEGER,
                references: {
                    model: 'affiliates',
                    key: 'id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
            },
            name: {
                type: STRING,
            },
            email: {
                type: STRING,
            },
            affiliate_name: {
                type: STRING,
            },
            is_round_trip: {
                type: BOOLEAN,
            },
            parent_of: {
                type: FLOAT,
            },
            child_of: {
                type: FLOAT,
            },
            is_meet_and_greet: {
                type: BOOLEAN,
            },
            extra_miles_amount: {
                type: INTEGER,
            },
            status: {
                type: STRING,
                defaultValue: 'created',
            },
            pick_up_date_time: {
                type: DATE,
            },
            return_pick_up_date_time: {
                type: DATE,
            },
            hotel_name: {
                type: STRING,
            },
            pick_up_location: {
                type: STRING,
            },
            checking_location: {
                type: STRING,
            },
            drop_off_location: {
                type: STRING,
            },
            phone_number: {
                type: STRING,
            },
            no_of_passenger: {
                type: INTEGER,
            },
            flight_number: {
                type: STRING,
            },
            service: {
                type: STRING,
            },
            miles: {
                type: FLOAT,
            },
            comments: {
                type: STRING,
            },
            gratuity: {
                type: FLOAT,
            },
            custom_gratuity: {
                type: FLOAT,
            },
            amount: {
                type: FLOAT,
            },
            international_phone_number: {
                type: STRING,
            },
            meet_and_greet: {
                type: TEXT,
            },
            draft_payload: {
                type: TEXT,
            },
            customer_id: {
                type: STRING,
            },
            payment_type: {
                type: STRING,
            },
            transaction_id: {
                type: STRING,
            },
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('reservations');
    },
};

import { Errors } from '../en.js';

export default function (sequelize, DataTypes) {
    const { STRING, FLOAT, BOOLEAN } = DataTypes;
    let _models = {};
    const DiscountCodes = sequelize.$$defineModel(
        'DiscountCodes',
        {
            code: {
                type: STRING,
                allowNull: false,
                unique: {
                    args: true,
                    msg: Errors.DiscountCodes.Code.Unique,
                },
            },
            type: {
                type: STRING,
                defaultValue: 'general',
            },
            from: {
                type: STRING,
                allowNull: false,
            },
            to: {
                type: STRING,
                allowNull: false,
            },
            percentage: {
                type: FLOAT,
                validate: {
                    max: {
                        args: [100],
                        msg: Errors.DiscountCodes.Percentage.Max,
                    },
                },
            },
            amount: {
                type: FLOAT,
            },
            isActive: {
                type: BOOLEAN,
                defaultValue: true,
            },
        },
        {
            validate: {},
            paranoid: false,
        }
    );

    /* ================== Model Associations ================== */
    DiscountCodes.associate = (models) => {
        _models = models;
    };

    /* ================== Instance Methods ================== */


    /* ================== Class Methods ================== */

    return DiscountCodes;
};

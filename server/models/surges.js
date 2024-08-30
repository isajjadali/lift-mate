import { Errors } from '../en.js';

export default function (sequelize, DataTypes) {
    const { TEXT, FLOAT, BOOLEAN, STRING } = DataTypes;
    const Surges = sequelize.$$defineModel(
        'Surges',
        {
            name: {
                type: STRING,
                allowNull: false,
            },
            description: {
                type: TEXT,
                allowNull: false,
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
                        msg: Errors.Surges.Percentage.Max,
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
        }
    );
    return Surges;
};

import { Errors } from '../en.js';

export default function (sequelize, DataTypes) {
    const { INTEGER, FLOAT, STRING, TEXT } = DataTypes;
    let _models = {};
    const ReservationSurges = sequelize.$$defineModel(
        'ReservationSurges',
        {
            reservationId: {
                type: INTEGER,
            },
            amount: {
                type: FLOAT,
                allowNull: false,
            },
            percentage: {
                type: FLOAT,
                validate: {
                    max: {
                        args: [100],
                        msg: Errors.ReservationSurges.Percentage.Max,
                    },
                },
            },
            name: {
                type: STRING,
                allowNull: false,
            },
            description: {
                type: TEXT,
                allowNull: false,
            },
        },
        {
            validate: {},
            paranoid: false,
        }
    );
    ReservationSurges.associate = (models) => {
        _models = models;
        ReservationSurges.belongsTo(models.Reservations, {
            foreignKey: 'reservationId',
            as: models.Reservations.$$singularName,
        });
    };
    return ReservationSurges;
};

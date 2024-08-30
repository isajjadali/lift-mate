import { Errors } from '../en.js';

export default function (sequelize, DataTypes) {
    const { INTEGER, FLOAT,STRING} = DataTypes;
    let _models = {};
    const ReservationDiscountCodes = sequelize.$$defineModel(
        'ReservationDiscountCodes',
        {
            reservationId: {
                type: INTEGER,
            },
            code: {
                type: STRING,
            },
            amount: {
                type: FLOAT,
            },
            type: {
                type: STRING,
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
        },
        {
            validate: {},
            paranoid: false,
        }
    );
    ReservationDiscountCodes.associate = (models) => {
        _models = models;
        ReservationDiscountCodes.belongsTo(models.Reservations, {
            foreignKey: 'reservationId',
            as: models.Reservations.$$singularName,
        });
                
    };
    return ReservationDiscountCodes;
};

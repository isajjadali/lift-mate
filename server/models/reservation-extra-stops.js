import { Errors } from '../en.js';

export default function (sequelize, DataTypes) {
    const { INTEGER, STRING } = DataTypes;
    let _models = {};
    const ReservationExtraStops = sequelize.$$defineModel(
        'ReservationExtraStops',
        {
            reservationId: {
                type: INTEGER,
            },
            value: {
                type: STRING,
            },
        },
        {
            validate: {},
            paranoid: false,
        }
    );
    ReservationExtraStops.associate = (models) => {
        _models = models;
        ReservationExtraStops.belongsTo(models.Reservations, {
            foreignKey: 'reservationId',
            as: models.Reservations.$$singularName,
        });
    };
    return ReservationExtraStops;
};

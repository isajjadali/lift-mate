export default function (sequelize, DataTypes) {
    const { TEXT,INTEGER } = DataTypes;
    const ReservationsPayments = sequelize.$$defineModel(
        'ReservationsPayments',
        {  
            reservationId : {
                type: INTEGER,
            },
            detail : {
                type: TEXT,
                get: function () {
                    return JSON.parse(this.getDataValue('detail'));
                },
                set: function (value) {
                    this.setDataValue('detail', JSON.stringify(value));
                },
            }
        },
    );
    ReservationsPayments.associate = (models) => {
        ReservationsPayments.belongsTo(models.Reservations, {
            foreignKey: 'reservationId',
            as: models.Reservations.$$singularName,
        });
    };
    return ReservationsPayments;
};

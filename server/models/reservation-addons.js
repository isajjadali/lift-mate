export default function (sequelize, DataTypes) {
    const { STRING, FLOAT,INTEGER } = DataTypes;
    let _models = {};
    const ReservationAddons = sequelize.$$defineModel(
        'ReservationAddons',
        {
            reservationId: {
                type: INTEGER,
                allowNull: false,
                references: {
                    model: 'reservations',
                    key: 'id',
                },
            },
            name: {
                type: STRING,
                allowNull: false,
            },
            percentage: {
                type: INTEGER,
            },
            amount: {
                type: FLOAT,
            },
            comments: {
                type: STRING,
            },
        },
        {
            validate: {},
        }
    );
    ReservationAddons.associate = (models) => {
        ReservationAddons.belongsTo(models.Reservations, {
            foreignKey: 'reservationId',
            as: models.Reservations.$$singularName,
        });
    };
    return ReservationAddons;
};

export default function (sequelize, DataTypes) {
    const { STRING, INTEGER,FLOAT,BOOLEAN } = DataTypes;
    const ReservationDetails = sequelize.$$defineModel('ReservationDetails', {
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
        },
        carId: {
            type: INTEGER,
            allowNull: false,
        },
        price: {
            type: FLOAT,
        },
        driverId: {
            type: INTEGER,
        },
        description: {
            type: STRING,
        },
        toMultiply: {
            type: FLOAT,
            allowNull: false,
        },
        imageUrl: {
            type: STRING,
        },
        awsObjectKey: {
            type: STRING,
        },
        toAdd: {
            type: FLOAT,
            allowNull: false,
        },
        isActive: {
            type: BOOLEAN,
            defaultValue: true,
        },
        minimumRate: {
            type: FLOAT,
            allowNull: false,
        },
        quantity: {
            type: INTEGER,
            defaultValue: 1,
        },
        maxPassenger: {
            type: INTEGER,
        },
        maxBags: {
            type: INTEGER,
        },
        requiredCars: {
            type: INTEGER,
        },
        isPaid: {
            type: BOOLEAN,
            defaultValue: false,
        },
    });
    ReservationDetails.associate = (models) => {
        ReservationDetails.belongsTo(models.Reservations, {
            foreignKey: 'reservationId',
            as: models.Reservations.$$singularName,
        });
        ReservationDetails.belongsTo(models.Cars, {
            foreignKey: 'carId',
            as: models.Cars.$$singularName,
        });
        ReservationDetails.belongsTo(models.Users, {
            foreignKey: 'driverId',
            as: models.Users.$$singularName,
        });
    };
    return ReservationDetails;
};

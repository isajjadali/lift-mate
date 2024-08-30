import { Errors } from '../en.js';
import sequelizeOp from 'sequelize';
const { Op } = sequelizeOp

export default function (sequelize, DataTypes) {
    const { STRING, INTEGER, FLOAT, BOOLEAN } = DataTypes;
    const Cars = sequelize.$$defineModel(
        'Cars',
        {
            name: {
                type: STRING,
                allowNull: false,
                validate: {
                    isUnique(value) {
                        return Cars.$$findOne({
                            query: {
                                where: {
                                    name: value,
                                    id: {
                                        [Op.ne]: this.getDataValue('id'),
                                    },
                                },
                            },
                            throwError: false,
                        }).then((car) => {
                            if (car) throw Errors.Cars.Name.Unique;
                        });
                    },
                },
            },
            toMultiply: {
                type: FLOAT,
                allowNull: false,
            },
            imageUrl: {
                type: STRING,
            },
            compressedImageUrl: {
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
        },
        {
            paranoid: false,
        }
    );
    Cars.associate = (models) => {
        Cars.hasMany(models.ReservationDetails, {
            foreignKey: 'carId',
            as: models.ReservationDetails.$$name,
            onDelete: 'cascade',
        });
    };
    return Cars;
};

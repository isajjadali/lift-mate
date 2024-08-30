import { Errors } from '../en.js';

export default function (sequelize, DataTypes) {
    const { STRING } = DataTypes;
    const Affiliates = sequelize.$$defineModel(
        'Affiliates',
        {
            name: {
                type: STRING,
                allowNull: false,
                validate: {
                    isUnique(value) {
                        return Affiliates.$$findOne({
                            query: { where: { name: value } },
                            throwError: false,
                        }).then((affiliate) => {
                            if (affiliate) throw Errors.Affiliates.Name.Unique;
                        });
                    },
                },
            },
        },
        {
            validate: {},
            paranoid: false,
        }
    );
    Affiliates.associate = (models) => {
        Affiliates.hasMany(models.Reservations, {
            foreignKey: 'affiliateId',
            as: models.Reservations.$$name,
        });
    };

    return Affiliates;
};

import { Errors } from '../en.js';

export default function (sequelize, DataTypes) {
    const { STRING, FLOAT, BOOLEAN } = DataTypes;
    const Addons = sequelize.$$defineModel(
        'Addons',
        {
            name: {
                type: STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isUnique(value) {
                        return Addons.$$findOne({
                            query: { where: { name: value } },
                            throwError: false,
                        }).then((addon) => {
                            if (addon) throw Errors.Addons.Name.Unique;
                        });
                    },
                },
            },
            amount: {
                type:  FLOAT,
            },
            percentage: {
                type:  FLOAT,
                validate: {
                    max: {
                        args: [100],
                        msg: Errors.Addons.Percentage.Max,
                    },
                },
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
    return Addons;
};

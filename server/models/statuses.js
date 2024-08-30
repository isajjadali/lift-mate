import { getSetMethods } from '../lib/sequelize.js';

export default function (sequelize, DataTypes) {
    const { STRING } = DataTypes;
    const Statuses = sequelize.$$defineModel(
        'Statuses',
        {
            name: {
                type: STRING,
                allowNull: false,
                ...getSetMethods.call(this, 'name'),
            },
            type: {
                type: STRING,
                allowNull: false,
            },
        },
    );
    return Statuses;
};

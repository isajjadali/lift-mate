import { Errors } from '../en.js';

export default function (sequelize, DataTypes) {
    const { STRING, INTEGER } = DataTypes;
    let _models = {};
    const UserRoles = sequelize.$$defineModel(
        'UserRoles',
        {
            roleId: {
                type: INTEGER,
                allowNull: false,
                references: {
                    model: 'roles',
                    key: 'id',
                },
            },
            userId: {
                type: INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
        },
        {
            validate: {},
            paranoid: false,
        }
    );
    UserRoles.associate = (models) => {
        _models = models;
        UserRoles.belongsTo(models.Users, {
            as: models.Users.$$singularName,
            foreignKey: 'userId',
        });
        UserRoles.belongsTo(models.Roles, {
            as: models.Roles.$$singularName,
            foreignKey: 'roleId',
        });
    };
    return UserRoles;
};

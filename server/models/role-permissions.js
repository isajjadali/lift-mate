import { Errors } from '../en.js';

export default function (sequelize, DataTypes) {
    const { STRING,INTEGER } = DataTypes;
    let _models = {};
    const RolePermissions = sequelize.$$defineModel(
        'RolePermissions',
        {
            roleId: {
                type: INTEGER,
                allowNull: false,
                references: {
                    model: 'roles',
                    key: 'id',
                },
            },
            permissionId: {
                type: INTEGER,
                allowNull: false,
                references: {
                    model: 'permissions',
                    key: 'id',
                },
            },
        },
        {
            validate: {},
            paranoid: false,
        },
    );
    RolePermissions.associate = (models) => {
        _models = models;
        RolePermissions.belongsTo(models.Roles, {
            as: models.Roles.$$singularName,
            foreignKey: 'roleId',
        });
        RolePermissions.belongsTo(models.Permissions, {
            as: models.Permissions.$$singularName,
            foreignKey: 'permissionId',
        });
    };
    return RolePermissions;
};

import { Errors } from '../en.js';
export default function (sequelize, DataTypes) {
    const { STRING, FLOAT, BOOLEAN } = DataTypes;
    const Permissions = sequelize.$$defineModel(
        'Permissions',
        {
            name: {
                type: STRING,
                allowNull: false,
                unique: true,
                set: function (value) {
                    this.setDataValue('name',value.trim());
                },
                validate: {
                    isUnique(value) {
                        return Permissions.$$findOne({
                            query: { where: { name: value } },
                            throwError: false,
                        }).then((permission) => {
                            if (permission) throw Errors.Permissions.Name.Unique;
                        });
                    },
                },
            },
        },
        {
            validate: {},
            paranoid: false,
        },
    );
    Permissions.associate = (models) => {
        Permissions.belongsToMany(models.Roles, {
            through:  models.RolePermissions,
            as:  models.Roles.$$name,
            foreignKey: 'permissionId',
        });
    };
    return Permissions;
};

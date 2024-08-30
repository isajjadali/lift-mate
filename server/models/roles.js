import { Errors } from '../en.js';
export default function (sequelize, DataTypes) {
    const { STRING } = DataTypes;
    const Roles = sequelize.$$defineModel(
        'Roles',
        {
            name: {
                type: STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isUnique(value) {
                        return Roles.$$findOne({
                            query: { where: { name: value } },
                            throwError: false,
                        }).then((role) => {
                            if (role) throw Errors.Roles.Name.Unique;
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
    Roles.associate = (models) => {
        Roles.belongsToMany(models.Permissions, {
            through:  models.RolePermissions,
            as:  models.Permissions.$$name,
            foreignKey: 'roleId',
        });
        Roles.belongsToMany(models.Users, {
            through:  models.UserRoles,
            as: models.Users.$$name,
            foreignKey: 'roleId',
        });
    };
    return Roles;
};

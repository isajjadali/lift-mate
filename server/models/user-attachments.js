export default function (sequelize, DataTypes) {
    const { STRING, DATE, INTEGER } = DataTypes;
    const UserAttachments = sequelize.$$defineModel(
        'UserAttachments',
        {
            userId: {
                type: INTEGER,
                references: {
                    model: 'users',
                    key: 'id',
                },
                allowNull: false,
            },
            type: {
                type: STRING,
                allowNull: false,
            },
            imageUrl: {
                type: STRING,
                allowNull: false,
            },
            key: {
                type: STRING,
                allowNull: false,
            },
            expiresOn: {
                type: DATE,
                allowNull: false,
            },
        },
        {
            validate: {},
        }
    );
    UserAttachments.associate = (models) => {
        UserAttachments.belongsTo(models.Users, {
            foreignKey: 'userId',
            as: models.Users.$$singularName,
        });
    };
    return UserAttachments;
};

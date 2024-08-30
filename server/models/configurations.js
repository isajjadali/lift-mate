export default function (sequelize, DataTypes) {
    const { TEXT,INTEGER } = DataTypes;
    const Configurations = sequelize.$$defineModel(
        'Configurations',
        {  
            configs : {
                type: TEXT,
                get: function () {
                    return JSON.parse(this.getDataValue('configs'));
                },
                set: function (value) {
                    this.setDataValue('configs', JSON.stringify(value));
                },
            }
        },
    );
    return Configurations;
};

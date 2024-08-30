import _ from 'lodash';
import moment from 'moment';

function _addSnakeCaseFields(fields) {
    Object.keys(fields).forEach((key) => {
        fields[key].field = _.snakeCase(key);
    });
}

function _addConstraintOnFK(fields) {
    Object.keys(fields).forEach((key) => {
        if (fields[key].references) {
            fields[key] = {
                ...fields[key],
                onUpdate: 'cascade',
                onDelete: 'cascade',
            };
        }

    // if (((fields[key] || {}).type || {}).key === 'DATE') {
    //     fields[key].get = function () {
    //         return (
    //             this.getDataValue(key) &&
    //   moment(this.getDataValue(key)).format('yyyy-MM-DD')
    //         );
    //     };
    // }
    });
}

function getFields(DataTypes, fields) {
    const { INTEGER, DATE } = DataTypes;
    fields = {
        id: {
            field: 'id',
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        createdAt: {
            type: DATE,
            field: 'created_at',
        },
        updatedAt: {
            type: DATE,
            field: 'updated_at',
        },
        deletedAt: {
            type: DATE,
            field: 'deleted_at',
        },
        ...fields,
    };

    _addConstraintOnFK(fields);
    _addSnakeCaseFields(fields);
    return fields;
}

function getDefaultFields(DataTypes, fields) {
    const { NOW } = DataTypes;
    const defaultFields = getFields(DataTypes, fields);

    return {
        id: {
            ...defaultFields.id,
        },
        createdAt: {
            ...defaultFields.createdAt,

            defaultValue: NOW,
        },
        updatedAt: {
            ...defaultFields.updatedAt,

            defaultValue: NOW,
        },
        deletedAt: {
            ...defaultFields.deletedAt,
            defaultValue: null,
        },
        ...fields,
    };
}

function getSetMethods(field, getMethod = 'lowerCase') {
    return {
        get: function () {
            let value = this.getDataValue(field);
            if (getMethod === 'lowerCase') {
                value = (value || '').toLowerCase();
            }
            return _[getMethod](value);
        },
        set: function (value = '') {
            this.setDataValue(field, `${value}`.toLowerCase());
        },
    };
}

const sequelizeConfig = Object.freeze({
    Order: {
        Desc: (field = 'createdAt') => [[field, 'DESC']],
        Asc: (field = 'createdAt') => [[field, 'ASC']],
    },
});

export {
    sequelizeConfig,
    getDefaultFields,
    getFields,
    getSetMethods,
};

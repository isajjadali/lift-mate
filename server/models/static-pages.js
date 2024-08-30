import { Errors } from '../en.js';
import _ from 'lodash'

export default function (sequelize, DataTypes) {
    const { STRING, BOOLEAN,VIRTUAL,TEXT } = DataTypes;
    let _models = {};
    const StaticPages = sequelize.$$defineModel(
        'StaticPages',
        {
            title: {
                type: STRING,
                allowNull: false,
                // validate: {
                //     isUnique(value) {
                //         return StaticPages.$$findOne({
                //             query: { where: { title: value } },
                //             throwError: false
                //         }).then(page => { if (page) throw Errors.StaticPages.Title.Unique; });
                //     }
                // },
            },
            content: {
                type: TEXT,
                allowNull: false,
            },
            isActive: {
                type: BOOLEAN,
                defaultValue: false,
            },
            /* ================== Virtual Keys ================== */
            slug: {
                type: VIRTUAL,
                get: function () {
                    return _.kebabCase(this.getDataValue('title'));
                },
            },
        },
        {
            validate: {},
            paranoid: false,
        }
    );

    /* ================== Model Associations ================== */
    StaticPages.associate = (models) => {
        _models = models;
    };

    /* ================== Class Methods ================== */
    return StaticPages;
};

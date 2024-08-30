import moment from 'moment';
import _ from 'lodash';
const { upperFirst, upperCase, chain, camelCase } = _;
import * as Sequelize from 'sequelize';
import { getHashedPassword, createToken } from '../lib/common.js';
import { getSetMethods } from '../lib/sequelize.js';
import { Roles } from '../enums.js';
import { Errors } from '../en.js';

export default function (sequelize, DataTypes) {
    const { STRING, ENUM, VIRTUAL, BOOLEAN } = DataTypes;
    let _models = {};
    const Users = sequelize.$$defineModel(
        'Users',
        {
            firstName: {
                type: STRING,
                allowNull: false,
            },
            lastName: {
                type: STRING,
            },
            email: {
                type: STRING,
                allowNull: false,
                validate: {
                    isEmail: {
                        msg: Errors.Email.Invalid,
                    },
                    isUnique(value) {
                        return Users.$$findOne({
                            query: {
                                where: {
                                    email: value,
                                },
                            },
                            throwError: false,
                        }).then((user) => {
                            if (user) throw Errors.Email.Unique;
                        });
                    },
                },
            },
            password: {
                type: STRING,
                allowNull: false,
                $privateKey: true,
                set: function (value) {
                    this.setDataValue('password', getHashedPassword(value));
                },
            },
            token: {
                type: STRING,
            },
            tempEmail: {
                type: STRING,
            },
            phoneNumber: {
                type: STRING,
                validate: {
                    len: {
                        args: [14],
                        msg: Errors.Users.PhoneNumber.len,
                    },
                },
            },
            phoneType: {
                type: STRING,
            },
            socialSecurityNumber: {
                type: STRING,
            },
            dob: {
                type: STRING,
            },
            address: {
                type: STRING,
            },
            image: {
                type: STRING,
            },
            isCreatedAtReservation: {
                type: BOOLEAN,
                defaultValue: false,
            },
            /* ================== Virtual Keys ================== */
            phoneNumberAsEmail: {
                type: VIRTUAL,
                get: function () {
                    let number = (this.getDataValue('phoneNumber') || '').match(/\d/g);
                    number = (number || []).join('');
                    return `${number}${this.getDataValue('phoneType')}`;
                },
            },
            initials: {
                type: VIRTUAL,
                get: function () {
                    const lastName = this.getDataValue('lastName');
                    return upperCase(
                        `${(this.getDataValue('firstName') || '')[0]}${
                            lastName ? `${lastName[0]}` : ''
                        }`
                    );
                },
            },
            fullName: {
                type: VIRTUAL,
                get: function () {
                    const lastName = this.getDataValue('lastName');
                    return `${this.getDataValue('firstName')}${
                        lastName ? ` ${lastName}` : ''
                    }`;
                },
            },
            age: {
                type: VIRTUAL,
                get: function () {
                    const dob = this.getDataValue('dob');
                    if (!dob) {
                        return null;
                    }
                    return moment().diff(moment(dob), 'years');
                },
            },
        },
        {
            validate: {},
        }
    );

    /* ================== Model Associations ================== */
    Users.associate = (models) => {
        _models = models;
        Users.hasMany(models.Reservations, {
            foreignKey: 'userId',
            as: models.Reservations.$$name,
        });
        Users.hasMany(models.ReservationDetails, {
            foreignKey: 'driverId',
            as: models.ReservationDetails.$$name,
        });
        Users.hasMany(models.UserAttachments, {
            foreignKey: 'userId',
            as: models.UserAttachments.$$name,
        });
        Users.belongsToMany(models.Roles, {
            through: models.UserRoles,
            as: models.Roles.$$name,
            foreignKey: 'userId',
        });
    };

    /* ================== Instance Methods ================== */
    Users.prototype.createToken = function (obj = {}) {
        return createToken({
            id: this.id,
            email: this.email,
            ...obj,
        });
    };
    Users.prototype.setRolesAndPermissions = async function () {
        const userRoles = await _models.UserRoles.findAll({
            where: {
                userId: this.id,
            },
            include: [
                {
                    model: _models.Roles,
                    as: _models.Roles.$$singularName,
                    include: [
                        {
                            model: _models.Permissions,
                            as: _models.Permissions.$$name,
                        },
                    ],
                },
            ],
        });

        this.dataValues.permissions = chain(userRoles)
            .map((userRole) => userRole.role.Permissions)
            .flattenDeep()
            .map((p) => p.name)
            .value();

        chain(userRoles)
            .map((userRole) => userRole.role.name)
            .flattenDeep()
            .forEach((i) => {
                this.dataValues[`is${upperFirst(camelCase(i))}`] = true;
            })
            .value();

        if (this.dataValues.isSuperAdmin) {
            this.dataValues.isAdmin = true;
        }
    };

    return Users;
};

'use strict';

import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import pluralize from 'pluralize';
import _ from 'lodash';
const { singular } = pluralize;

import config from '../config/database.js';
import { getFields } from '../lib/sequelize.js';
const { database, username, password } = config;
import { Errors, $translate } from '../en.js';
const __dirname = path.resolve(process.cwd(), 'server', 'models');
const basename = path.basename(path.resolve(__dirname, 'index.js'));
import logger from '../lib/logger.js';

Sequelize.prototype.$$defineModel = function (
  modelName = '',
  fields = {},
  config = {}
) {
  const model = this.define(
    _.snakeCase(modelName),
    { ...getFields(Sequelize.DataTypes, fields) },
    {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      ...(config.paranoid ? { deletedAt: 'deletedAt' } : {}),
      ...config,
    }
  );

  model.$$singularName = singular(model.name);
  model.$$name = _.startCase(_.camelCase(model.name)).replace(/ /g, '');
  model.$$singularNameInStartCase = _.startCase(model.$$singularName);

  model.__proto__.$$findOne = function ({
    query = {},
    options = {},
    throwError = true,
    error = '',
  }) {
    return this.findOne(query, options).then(res => {
      if (!res && throwError) {
        return Promise.reject({
          error:
            error ||
            $translate(Errors.Models.NotFound, {
              modelName: this.$$singularNameInStartCase,
            }),
          statusCode: 400,
        });
      }
      return res;
    });
  };

  model.__proto__.$$findByPk = function ({
    id,
    throwError = true,
    error = '',
  }) {
    return this.findByPk(id).then(res => {
      if (!res && throwError) {
        return Promise.reject({
          error:
            error ||
            $translate(Errors.Models.InvalidId, {
              modelName: this.$$singularNameInStartCase,
            }),
          statusCode: 400,
        });
      }
      return res;
    });
  };

  model.__proto__.$$bulkCreate = function (data = []) {
    return Promise.all(
      data.map(
        item =>
          new Promise((resolve, reject) => {
            this.create(item)
              .then(res => resolve(res))
              .catch(e => reject(e));
          })
      )
    );
  };

  model.prototype.toJSON = function () {
    const _this = Object.assign({}, this.get());
    Object.keys(model.rawAttributes)
      .filter(field => model.rawAttributes[field].$privateKey)
      .forEach(field => delete _this[field]);
    return _this;
  };

  return model;
};

const sequelize = new Sequelize(database, username, password, config);
sequelize
  .authenticate()
  .then(() =>
    logger.info(
      'Database connection has been established successfully.'
    )
  )
  .done();

// We don't need it anymore
// sequelize.sync({
//     alter: true,
//     force:true,
// });

let db = {};
function getNormalizedNameOfModel(modelName) {
  return _.startCase(modelName).replace(/\s/g, '');
}

const files = fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  // .forEach(async file => {
  //   let modelModule = await import(`file://${path.join(__dirname, file)}`);
  //   modelModule = modelModule.default || modelModule;

  //   const model = modelModule(sequelize, Sequelize.DataTypes);

  //   const normalizedName = getNormalizedNameOfModel(model.name);
  //   db[normalizedName] = model;
  // });

for (const file of files) {
  let modelModule = await import(`file://${path.join(__dirname, file)}`);
  modelModule = modelModule.default || modelModule;

  const model = modelModule(sequelize, Sequelize.DataTypes);
  const normalizedName = getNormalizedNameOfModel(model.name);
  db[normalizedName] = model;
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db = {
  ...db,
  sequelize: sequelize,
  Sequelize: Sequelize,
};

export default {
  ...db,
  sequelize: sequelize,
  Sequelize: Sequelize,
};

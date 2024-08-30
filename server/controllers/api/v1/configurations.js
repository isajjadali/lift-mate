import asyncMiddleware from '~/server/middlewares/response/async-middleware.js';
import db from '~/server/models/index.js';
const { Configurations } = db;
import { sequelizeConfig } from '../../../lib/sequelize.js';
import hasPermission from '../../../middlewares/has-permission.js';
import { PERMISSIONS } from '../../../permissions.js';
import express from 'express';

const router = express.Router();

router.get(
  '/',
  asyncMiddleware(async (req, res) => {
    const configuration = await Configurations.$$findOne({
      query: {
        where: {},
        order: sequelizeConfig.Order.Desc(),
      },
    });
    return res.http200(configuration.configs);
  })
);

router.put(
  '/:configId',
  [hasPermission(PERMISSIONS.configurationsView)],
  asyncMiddleware(async (req, res) => {
    delete req.body.id;
    const updatedConfig = await Configurations.update(
      {
        configs: req.body,
      },
      {
        where: {
          id: 1,
        },
      }
    );
    return res.http200(updatedConfig.configs);
  })
);

export default router;

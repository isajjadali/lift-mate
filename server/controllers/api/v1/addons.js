import asyncMiddleware from '~/server/middlewares/response/async-middleware.js';
import { sequelizeConfig } from '../../../lib/sequelize.js';
import db from '~/server/models/index.js';
const { Addons, Sequelize } = db;

import hasPermission from '../../../middlewares/has-permission.js';
import { PERMISSIONS } from '../../../permissions.js';
import express from 'express';

const router = express.Router();

router
  .route('/')
  .get(
    [hasPermission(PERMISSIONS.addonsView)],
    asyncMiddleware(async (req, res) => {
      const query = {
        ...req.query,
        where: {},
        order: sequelizeConfig.Order.Desc(),
      };

      if (req.query.search) {
        const likeObject = {
          [Sequelize.Op.like]: `${req.query.search}%`,
        };
        query.where[Sequelize.Op.or] = [
          {
            name: likeObject,
          },
          {
            percentage: likeObject,
          },
          {
            amount: likeObject,
          },
        ];
      }

      if (req.query.isActive) {
        query.where.isActive = req.query.isActive;
      }

      if (req.query.toDate) {
        query.where.createdAt = {
          [Sequelize.Op.between]: [
            req.query.fromDate,
            req.query.toDate,
          ],
        };
      }

      const addons = await Addons.findAndCountAll(query);
      return res.http200(addons.rows, { count: addons.count });
    })
  )
  .post(
    [hasPermission(PERMISSIONS.addonsCreate)],
    asyncMiddleware(async (req, res) => {
      delete req.body.id;
      const addon = await Addons.create(req.body);
      return res.http200(addon);
    })
  );

router.param(
  'addonId',
  asyncMiddleware(async (req, res, next, addonId) => {
    const addon = await Addons.$$findByPk({ id: +addonId });
    req.addon = addon;
    next();
  })
);

router
  .route('/:addonId')
  .get(
    [hasPermission(PERMISSIONS.addonsView)],
    asyncMiddleware(async (req, res) => {
      res.http200(req.addon);
    })
  )
  .put(
    [hasPermission(PERMISSIONS.addonsEdit)],
    asyncMiddleware(async (req, res) => {
      delete req.body.id;
      const updatedAddon = await req.addon.update(req.body);
      return res.http200(updatedAddon);
    })
  )
  .delete(
    [hasPermission(PERMISSIONS.addonsDelete)],
    asyncMiddleware(async (req, res) => {
      const ids = [...(req.query.ids || []), req.params.addonId];
      await Addons.destroy({ where: { id: ids } });
      return res.http200('Deleted Addon successfully!');
    })
  );

export default router;

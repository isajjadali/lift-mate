import asyncMiddleware from '~/server/middlewares/response/async-middleware.js';
import { sequelizeConfig } from '~/lib/sequelize.js';
import db from '~/server/models/index.js';
const { DriverMeta, Sequelize } = db;

import hasPermission from '~/middlewares/has-permission.js';
import { PERMISSIONS } from '~/permissions.js';
import express from 'express';

const router = express.Router();

// CRUD Operations for DriverMeta
router
  .route('/')
  .get(
    [hasPermission(PERMISSIONS.driverMetaView)],
    asyncMiddleware(async (req, res) => {
      const query = {
        ...req.query,
        where: {},
        order: sequelizeConfig.Order.Desc(),
      };

      // Search functionality
      if (req.query.search) {
        const likeObject = {
          [Sequelize.Op.like]: `${req.query.search}%`,
        };
        query.where[Sequelize.Op.or] = [
          {
            name: likeObject,
          },
          {
            description: likeObject,
          },
          {
            type: likeObject,
          },
        ];
      }

      // Active filter
      if (req.query.isActive || req.query.isActive === false) {
        query.where.isActive = req.query.isActive;
      }

      // Date range filter
      if (req.query.toDate && req.query.fromDate) {
        query.where.createdAt = {
          [Sequelize.Op.between]: [req.query.fromDate, req.query.toDate],
        };
      }

      // Fetch DriverMeta data
      const driverMeta = await DriverMeta.findAndCountAll(query);
      return res.http200(driverMeta.rows, { count: driverMeta.count });
    })
  )
  .post(
    [hasPermission(PERMISSIONS.driverMetaCreate)],
    asyncMiddleware(async (req, res) => {
      delete req.body.id;
      const driverMeta = await DriverMeta.create(req.body);
      return res.http200(driverMeta);
    })
  );

// Parameter handler for driverMetaId
router.param(
  'driverMetaId',
  asyncMiddleware(async (req, res, next, driverMetaId) => {
    const driverMeta = await DriverMeta.findByPk(driverMetaId);
    if (!driverMeta) {
      return res.http404('DriverMeta not found');
    }
    req.driverMeta = driverMeta;
    next();
  })
);

// CRUD for a specific DriverMeta by ID
router
  .route('/:driverMetaId')
  .get(
    [hasPermission(PERMISSIONS.driverMetaView)],
    asyncMiddleware(async (req, res) => {
      res.http200(req.driverMeta);
    })
  )
  .put(
    [hasPermission(PERMISSIONS.driverMetaEdit)],
    asyncMiddleware(async (req, res) => {
      delete req.body.id;
      const updatedDriverMeta = await req.driverMeta.update(req.body);
      return res.http200(updatedDriverMeta);
    })
  )
  .delete(
    [hasPermission(PERMISSIONS.driverMetaDelete)],
    asyncMiddleware(async (req, res) => {
      const ids = [...(req.query.ids || []), req.params.driverMetaId];
      await DriverMeta.destroy({ where: { id: ids } });
      return res.http200('Deleted DriverMeta successfully!');
    })
  );

export default router;

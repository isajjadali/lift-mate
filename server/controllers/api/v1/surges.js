import asyncMiddleware from '~/server/middlewares/response/async-middleware.js';
import { sequelizeConfig } from '../../../lib/sequelize.js';
import db from '~/server/models/index.js';
const { Surges, Sequelize } = db;
import { app } from '~/server/config/config.json';
const regex = app.regex;
import hasPermission from '../../../middlewares/has-permission.js';
import { PERMISSIONS } from '../../../permissions.js';
import express from 'express';

const router = express.Router();

router
  .route('/')
  .get(
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
            description: likeObject,
          },
          // {
          //     from: {
          //         $lte: req.query.startDate,
          //         $gte: req.query.endDate,
          //     },
          //     to: {
          //         $lte: req.query.startDate,
          //         $gte: req.query.endDate,
          //     },
          // },
          {
            percentage: likeObject,
          },
          {
            amount: likeObject,
          },
        ];
      }
      if (req.query.toDate) {
        query.where.createdAt = {
          [Sequelize.Op.between]: [
            req.query.fromDate,
            req.query.toDate,
          ],
        };
      }

      if (req.query.isActive || req.query.isActive === false) {
        query.where.isActive = req.query.isActive;
      }
      const surges = await Surges.findAndCountAll(query);
      return res.http200(surges.rows, { count: surges.count });
    })
  )
  .post(
    [hasPermission(PERMISSIONS.surgesCreate)],
    asyncMiddleware(async (req, res) => {
      delete req.body.id;
      const surge = await Surges.create(req.body);
      return res.http200(surge);
    })
  );

router.get(
  '/available',
  asyncMiddleware(async (req, res) => {
    const date = req.query.date;
    const activeSurges = await Surges.findAndCountAll({
      where: {
        from: {
          [Sequelize.Op.lte]: new Date(date),
        },
        to: {
          [Sequelize.Op.gte]: new Date(date),
        },
        isActive: true,
      },
    });
    res.http200(activeSurges.rows, { count: activeSurges.count });
  })
);

router.param(
  'surgeId',
  asyncMiddleware(async (req, res, next, surgeId) => {
    const surge = await Surges.$$findByPk({ id: +surgeId });
    req.surge = surge;
    next();
  })
);

router
  .route(`/:surgeId${regex.alphanumericWithAtLeastOneNumber}`)
  .get(
    [hasPermission(PERMISSIONS.surgesView)],
    asyncMiddleware(async (req, res) => {
      res.http200(req.surge);
    })
  )
  .put(
    [hasPermission(PERMISSIONS.surgesEdit)],
    asyncMiddleware(async (req, res) => {
      delete req.body.id;
      const updatedSurge = await req.surge.update(req.body);
      return res.http200(updatedSurge);
    })
  )
  .delete(
    [hasPermission(PERMISSIONS.surgesDelete)],
    asyncMiddleware(async (req, res) => {
      const ids = [...(req.query.ids || []), req.params.surgeId];
      await Surges.destroy({ where: { id: ids } });
      return res.http200('Deleted surge successfully!');
    })
  );

export default router;

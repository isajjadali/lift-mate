import asyncMiddleware from '~/server/middlewares/response/async-middleware.js';
import { sequelizeConfig } from '../../../lib/sequelize.js';
import db from '~/server/models/index.js';
const { Affiliates, Sequelize } = db;
import hasPermission from '../../../middlewares/has-permission.js';
import { PERMISSIONS } from '../../../permissions.js';
import express from 'express';

const router = express.Router();

router
  .route('/')
  .get(
    [hasPermission(PERMISSIONS.affiliatesView)],
    asyncMiddleware(async (req, res) => {
      const query = {
        where: {},
        order: sequelizeConfig.Order.Desc(),
      };
      if (req.query.toDate) {
        query.where.createdAt = {
          [Sequelize.Op.between]: [
            req.query.fromDate,
            req.query.toDate,
          ],
        };
      }

      if (req.query.search) {
        // query.where.likeObject = {
        //     [Sequelize.Op.like]: `${req.query.search}%`,
        // };
        const likeObject = {
          [Sequelize.Op.like]: `${req.query.search}%`,
        };
        query.where[Sequelize.Op.or] = [
          {
            name: likeObject,
          },
        ];
      }

      const affiliate = await Affiliates.findAndCountAll(query);
      return res.http200(affiliate.rows, { count: affiliate.count });
    })
  )
  .post(
    [hasPermission(PERMISSIONS.affiliatesCreate)],
    asyncMiddleware(async (req, res) => {
      delete req.body.id;
      const affiliate = await Affiliates.create(req.body);
      return res.http200(affiliate);
    })
  );

router.param(
  'affiliateId',
  asyncMiddleware(async (req, res, next, affiliateId) => {
    const affiliate = await Affiliates.$$findByPk({
      id: +affiliateId,
    });
    req.affiliate = affiliate;
    next();
  })
);

router
  .route('/:affiliateId')
  .get(
    [hasPermission(PERMISSIONS.affiliatesView)],
    asyncMiddleware(async (req, res) => {
      res.http200(req.affiliate);
    })
  )
  .put(
    [hasPermission(PERMISSIONS.affiliatesEdit)],
    asyncMiddleware(async (req, res) => {
      delete req.body.id;
      const updatedAffiliate = await req.affiliate.update(req.body);
      return res.http200(updatedAffiliate);
    })
  )
  .delete(
    [hasPermission(PERMISSIONS.affiliatesDelete)],
    asyncMiddleware(async (req, res) => {
      const ids = [...(req.query.ids || []), req.params.affiliateId];
      await Affiliates.destroy({ where: { id: ids } });
      return res.http200('Deleted Affliate successfully!');
    })
  );

export default router;

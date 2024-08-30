import asyncMiddleware from '~/server/middlewares/response/async-middleware.js';
import { sequelizeConfig } from '../../../lib/sequelize.js';
import db from '~/server/models/index.js';
const { DiscountCodes, Sequelize } = db;
import hasPermission from '../../../middlewares/has-permission.js';
import { PERMISSIONS } from '../../../permissions.js';
import { DiscountCodesType } from '~/server/enums.js';
import express from 'express';

const router = express.Router();

router
  .route('/')
  .get(
    [hasPermission(PERMISSIONS.discountCodesView)],
    asyncMiddleware(async (req, res) => {
      const query = {
        // ...req.query,
        where: {},
        order: sequelizeConfig.Order.Desc(),
      };

      if (req.query.search) {
        const likeObject = {
          [Sequelize.Op.like]: `${req.query.search}%`,
        };
        query.where[Sequelize.Op.or] = [
          {
            code: likeObject,
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

      if (req.query.isActive) {
        query.where.isActive = req.query.isActive;
      }

      if (req.query.type) {
        query.where.type = {
          [Sequelize.Op.in]: req.query.type.split(','),
        };
      }

      const discountCodes = await DiscountCodes.findAndCountAll(
        query
      );
      return res.http200(discountCodes.rows, {
        count: discountCodes.count,
      });
    })
  )
  .post(
    [hasPermission(PERMISSIONS.discountCodesCreate)],
    asyncMiddleware(async (req, res) => {
      delete req.body.id;
      const discountCode = await DiscountCodes.create(req.body);
      return res.http200(discountCode);
    })
  );

router.get(
  '/available',
  asyncMiddleware(async (req, res) => {
    const activeDiscountCodes = await DiscountCodes.findAndCountAll({
      where: {
        isActive: true,
        type: 'round trip',
        // from: {
        //     [Sequelize.Op.lte]: new Date(),
        // },
        to: {
          [Sequelize.Op.gte]: new Date(),
        },
      },
    });
    res.http200(activeDiscountCodes.rows[0]);
  })
);

router.param(
  'discountCodeId',
  asyncMiddleware(async (req, res, next, discountCodeId) => {
    const discountCode = await DiscountCodes.$$findByPk({
      id: +discountCodeId,
    });
    req.discountCode = discountCode;
    next();
  })
);

router.get(
  '/:code/verify',
  asyncMiddleware(async (req, res) => {
    const { code } = req.params;
    const { isRoundTrip } = req.query;

    const query = {
      where: {
        isActive: true,
        code: code,
      },
    };
    if (!isRoundTrip) {
      query.where.type = DiscountCodesType.General;
    }
    const discountCode = await DiscountCodes.$$findOne({
      query: query,
    });
    res.http200(discountCode);
  })
);

router
  .route('/:discountCodeId')
  .get(
    [hasPermission(PERMISSIONS.discountCodesView)],
    asyncMiddleware(async (req, res) => {
      res.http200(req.discountCode);
    })
  )
  .put(
    [hasPermission(PERMISSIONS.discountCodesEdit)],
    asyncMiddleware(async (req, res) => {
      delete req.body.id;
      if (req.body.type === 'round trip' && req.body.isActive) {
        await DiscountCodes.update(
          { isActive: false },
          {
            where: {
              type: 'round trip',
              id: { [Sequelize.Op.ne]: req.discountCode.id },
            },
          }
        );
      }
      const updatedDiscountCode = await req.discountCode.update(
        req.body
      );
      return res.http200(updatedDiscountCode);
    })
  )
  .delete(
    [hasPermission(PERMISSIONS.discountCodesDelete)],
    asyncMiddleware(async (req, res) => {
      const ids = [
        ...(req.query.ids || []),
        req.params.discountCodeId,
      ];
      await DiscountCodes.destroy({ where: { id: ids } });
      return res.http200('Deleted discount code successfully!');
    })
  );

export default router;

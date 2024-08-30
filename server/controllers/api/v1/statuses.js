import asyncMiddleware from '~/server/middlewares/response/async-middleware.js';
import { sequelizeConfig } from '../../../lib/sequelize.js';
import db from '~/server/models/index.js';
const { Statuses, Sequelize } = db;
import express from 'express';

const router = express.Router();

router.route('/').get(
  asyncMiddleware(async (req, res) => {
    const query = {
      where: {},
      order: sequelizeConfig.Order.Desc(),
    };

    if (req.query.type) {
      query.where.type = {
        [Sequelize.Op.like]: `${req.query.type}%`,
      };
    }

    const statuses = await Statuses.findAndCountAll(query);
    return res.http200(statuses.rows, {
      count: statuses.count,
    });
  })
);

export default router;

import asyncMiddleware from '~/server/middlewares/response/async-middleware.js';
import { sequelizeConfig } from '../../../lib/sequelize.js';
import db from '~/server/models/index.js';
const { StaticPages, Sequelize } = db;
import _ from 'lodash';
import hasPermission from '../../../middlewares/has-permission.js';
import { PERMISSIONS } from '../../../permissions.js';
import express from 'express';

const router = express.Router();

router
  .route('/')
  .post(
    [hasPermission(PERMISSIONS.staticPageEditorCreate)],
    asyncMiddleware(async (req, res) => {
      req.body = {
        ...req.body,
        content: '',
        isActive: false,
      };

      const staticPage = await StaticPages.create(req.body);
      return res.http200(staticPage);
    })
  )
  .get(
    [hasPermission(PERMISSIONS.staticPageEditorView)],
    asyncMiddleware(async (req, res) => {
      const query = {
        ...req.query,
        where: {},
        order: sequelizeConfig.Order.Desc(),
      };

      if (req.query.title) {
        query.where.title = {
          [Sequelize.Op.like]: `${req.query.title}%`,
        };
      }
      const pages = await StaticPages.findAndCountAll(query);
      return res.http200(pages.rows, { count: pages.count });
    })
  );

router.route('/slug/:slug').get(
  [hasPermission(PERMISSIONS.staticPageEditorView)],
  asyncMiddleware(async (req, res) => {
    const { slug } = req.params;
    const page = await StaticPages.$$findOne({
      query: {
        where: {
          title: _.startCase(slug),
        },
      },
    });
    res.http200(page);
  })
);

router.route('/available').get(
  [hasPermission(PERMISSIONS.staticPageEditorView)],
  asyncMiddleware(async (req, res) => {
    const query = {
        where: {
            isActive: true,
        },
    };
    const pages = await StaticPages.findAll(query);
    return res.http200(pages);
  })
);

router.param(
  'pageId',
  asyncMiddleware(async (req, res, next, pageId) => {
    const page = await StaticPages.$$findByPk({ id: +pageId });
    req.page = page;
    next();
  })
);

router.route('/:pageId').put(
  [hasPermission(PERMISSIONS.staticPageEditorView)],
  asyncMiddleware(async (req, res) => {
    delete req.body.id;
    const updatedpage = await req.page.update(req.body);
    return res.http200(updatedpage);
  })
);
// };

export default router;

import asyncMiddleware from '~/server/middlewares/response/async-middleware.js';
import { sequelizeConfig } from '~/lib/sequelize.js';
import db from '~/server/models/index.js';
const { Customers, Sequelize } = db;

import hasPermission from '~/middlewares/has-permission.js';
import { PERMISSIONS } from '~/permissions.js';
import express from 'express';

const router = express.Router();

// CRUD Operations for Customers
router
  .route('/')
  .get(
    [hasPermission(PERMISSIONS.customersView)],
    asyncMiddleware(async (req, res) => {
      const query = {
        ...req.query,
        where: {},
        order: sequelizeConfig.Order.Desc(),
      };

      // Search functionality (e.g., by name, email, or phone)
      if (req.query.search) {
        const likeObject = {
          [Sequelize.Op.like]: `${req.query.search}%`,
        };
        query.where[Sequelize.Op.or] = [
          { name: likeObject },
          { email: likeObject },
          { phone: likeObject },
        ];
      }

      // Active status filter
      if (req.query.isActive || req.query.isActive === false) {
        query.where.isActive = req.query.isActive;
      }

      // Date range filter for customer creation
      if (req.query.toDate && req.query.fromDate) {
        query.where.createdAt = {
          [Sequelize.Op.between]: [req.query.fromDate, req.query.toDate],
        };
      }

      // Fetch Customer data
      const customers = await Customers.findAndCountAll(query);
      return res.http200(customers.rows, { count: customers.count });
    })
  )
  .post(
    [hasPermission(PERMISSIONS.customersCreate)],
    asyncMiddleware(async (req, res) => {
      delete req.body.id;
      const customer = await Customers.create(req.body);
      return res.http200(customer);
    })
  );

// Parameter handler for customerId
router.param(
  'customerId',
  asyncMiddleware(async (req, res, next, customerId) => {
    const customer = await Customers.findByPk(customerId);
    if (!customer) {
      return res.http404('Customer not found');
    }
    req.customer = customer;
    next();
  })
);

// CRUD for a specific Customer by ID
router
  .route('/:customerId')
  .get(
    [hasPermission(PERMISSIONS.customersView)],
    asyncMiddleware(async (req, res) => {
      res.http200(req.customer);
    })
  )
  .put(
    [hasPermission(PERMISSIONS.customersEdit)],
    asyncMiddleware(async (req, res) => {
      delete req.body.id;
      const updatedCustomer = await req.customer.update(req.body);
      return res.http200(updatedCustomer);
    })
  )
  .delete(
    [hasPermission(PERMISSIONS.customersDelete)],
    asyncMiddleware(async (req, res) => {
      const ids = [...(req.query.ids || []), req.params.customerId];
      await Customers.destroy({ where: { id: ids } });
      return res.http200('Deleted Customer successfully!');
    })
  );

export default router;

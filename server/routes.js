import express from 'express';
import indexRouter from './controllers/api/v1/index.js';
import addonsRouter from './controllers/api/v1/addons.js';
import affiliatesRouter from './controllers/api/v1/affiliates.js'
import carsRouter from './controllers/api/v1/cars.js'
import configurationsRouter from './controllers/api/v1/configurations.js'
import discountCodesRouter from './controllers/api/v1/discount-codes.js'
import permissionsRouter from './controllers/api/v1/permissions.js'
import reservationsRouter from './controllers/api/v1/reservations.js'
import rolesRouter from './controllers/api/v1/roles.js'
import staticPagesRouter from './controllers/api/v1/static-pages.js'
import statusesRouter from './controllers/api/v1/statuses.js'
import surgesRouter from './controllers/api/v1/surges.js'
import usersRouter from './controllers/api/v1/users.js'

export default app => {
  const router = express.Router();
  const baseUrl = '/api/v1';

  app.use(`${baseUrl}`, indexRouter);
  app.use(`${baseUrl}/addons`, addonsRouter);
  app.use(`${baseUrl}/affiliates`, affiliatesRouter);
  app.use(`${baseUrl}/cars`, carsRouter);
  app.use(`${baseUrl}/configurations`, configurationsRouter);
  app.use(`${baseUrl}/discount-codes`, discountCodesRouter);
  app.use(`${baseUrl}/permissions`, permissionsRouter);
  app.use(`${baseUrl}/reservations`, reservationsRouter);
  app.use(`${baseUrl}/roles`, rolesRouter);
  app.use(`${baseUrl}/static-pages`, staticPagesRouter);
  app.use(`${baseUrl}/statuses`, statusesRouter);
  app.use(`${baseUrl}/surges`, surgesRouter);
  app.use(`${baseUrl}/users`, usersRouter);
};

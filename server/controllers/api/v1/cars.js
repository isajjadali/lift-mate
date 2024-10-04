import asyncMiddleware from '~/server/middlewares/response/async-middleware.js';
import { sequelizeConfig } from '../../../lib/sequelize.js';
import db from '~/server/models/index.js';
const { Cars, Sequelize } = db;
import uploadFile from '../../../lib/s3-uploader/index.js';
import hasPermission from '../../../middlewares/has-permission.js';
import { PERMISSIONS } from '../../../permissions.js';
import express from 'express';

const router = express.Router();

router
  .route('/')
  .get(
    [hasPermission(PERMISSIONS.carsView)],
    asyncMiddleware(async (req, res) => {
      const query = {
        ...req.query,
        where: {},
        order: sequelizeConfig.Order.Desc(),
      };
      if (req.query.search) {
        query.where.name = {
          [Sequelize.Op.like]: `${req.query.search}%`,
        };
      }
      if (req.query.toDate) {
        query.where.createdAt = {
          [Sequelize.Op.between]: [
            req.query.fromDate,
            req.query.toDate,
          ],
        };
      }
      const cars = await Cars.findAndCountAll(query);
      return res.http200(cars.rows, { count: cars.count });
    })
  )
  .post(
    [hasPermission(PERMISSIONS.carsCreate)],
    asyncMiddleware(async (req, res) => {
      delete req.body.id;
      const obj = {
        ...req.body,
        imageUrl: `${process.env.S3_AWS_URL}/red-car.png`,
        awsObjectKey: 'red-car.png',
      };
      const car = await Cars.create(obj);
      return res.http200(car);
    })
  );

router.get(
  '/available',
  [hasPermission(PERMISSIONS.carsView)],
  asyncMiddleware(async (req, res) => {
    const cars = await Cars.findAll({
      where: {
        isActive: true,
      },
    });
    return res.http200(cars);
  })
);

router.param(
  'carId',
  asyncMiddleware(async (req, res, next, carsId) => {
    const car = await Cars.$$findByPk({ id: +carsId });
    req.car = car;
    next();
  })
);

router.post(
  '/update-image/:id',
  [hasPermission(PERMISSIONS.carsEdit)],
  asyncMiddleware(async (req, res) => {
    const file = req.file;
    file.name = file.originalname;
    const { awsObjectKey = '' } = req.query;
    // const nonDeleteAbles = ['red-car', 'no-image', 'sedan', 'suv'];

    // if (!nonDeleteAbles.some((e) => awsObjectKey.includes(e))) {
    //     deleteFile(awsObjectKey).catch();
    // }

    const img = await uploadFile(file, { retainFile: true });
    const compressedImg = await uploadFile(file, { compress: true });

    await Cars.update(
      {
        imageUrl: img.Location,
        compressedImageUrl: compressedImg.Location,
        awsObjectKey: img.Key,
      },
      { where: { id: req.params.id } }
    );
    res.http200({ imageUrl: img.Location });
  })
);

router
  .route('/:carId')
  .get(
    [hasPermission(PERMISSIONS.carsView)],
    asyncMiddleware(async (req, res) => {
      res.http200(req.car);
    })
  )
  .put(
    [hasPermission(PERMISSIONS.carsEdit)],
    asyncMiddleware(async (req, res) => {
      delete req.body.id;
      const updatedCar = await req.car.update(req.body);
      return res.http200(updatedCar);
    })
  )
  .delete(
    [hasPermission(PERMISSIONS.carsDelete)],
    asyncMiddleware(async (req, res) => {
      const ids = [...(req.query.ids || []), req.params.carId];
      await Cars.destroy({ where: { id: ids } });
      return res.http200('Deleted car successfully!');
    })
  );

export default router;

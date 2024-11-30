import asyncMiddleware from '~/server/middlewares/response/async-middleware.js';
import { sequelizeConfig } from '../../../lib/sequelize.js';
import { Roles } from '~/server/enums.js';
import { generateRandomPassword } from '~/server/lib/common.js';
import db from '~/server/models/index.js';
const {
  Users,
  UserAttachments,
  Sequelize,
  ReservationDetails,
  Reservations,
  UserRoles,
  Roles: RolesModel
} = db;
import uploadFile from '../../../lib/s3-uploader/index.js';
import { deleteFile } from '../../../lib/s3-uploader/s3.js';
import SendMail from '../../../lib/email-sender/index.js';
import {
  oldPasswordValidator,
  passwordChangeValidator,
  newAndConfirmPasswordValidator,
} from '../../../middlewares/password.js';
import { app } from '~/server/config/config.json';
const regex = app.regex;
import hasPermission from '../../../middlewares/has-permission.js';
import { PERMISSIONS } from '../../../permissions.js';
import express from 'express';
import { Regex } from '~/server/enums.js';

const router = express.Router();

router
  .route('/')
  .get(
    [hasPermission(PERMISSIONS.customersView)],
    asyncMiddleware(async (req, res) => {
      const rolesWhere = {
        name: {
          [Sequelize.Op.in]: [Roles.driver, Roles.customer],
        },
      };

      if (req.query.role) {
        rolesWhere.name = req.query.role;
      }

      const query = {
        where: {},
        include: [
          {
            model: RolesModel,
            as: RolesModel.$$name,
            where: rolesWhere,
            through: UserRoles,
          },
        ],
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
            firstName: likeObject,
          },
          {
            lastName: likeObject,
          },
          {
            email: likeObject,
          },
          {
            socialSecurityNumber: likeObject,
          },
          {
            phoneNumber: likeObject,
          },
        ];
      }

      const users = await Users.findAndCountAll(query);
      return res.http200(users.rows, { count: users.count });
    })
  )
  .post(
    [hasPermission(PERMISSIONS.customersCreate)],
    asyncMiddleware(async (req, res) => {
      delete req.body.id;
      const role = req.query.role;
      const password = generateRandomPassword();
      const user = await Users.create({
        ...req.body,
        password,
      });

      const userRole = await RolesModel.$$findOne({
        query: {
          where: {
            name: role,
          },
        },
      });

      await UserRoles.create({
        roleId: userRole.id,
        userId: user.id,
      });

      await user.setRolesAndPermissions();

      const token = user.createToken();
      await user.update({ token: token });

      SendMail('set-password', {
        to: user.email,
        subject: `Set your password at ${process.env.APP_NAME_SPACED}!`,
        variables: {
          userName: user.fullName,
          url: `${process.env.FE_URL}/reset-password?token=${token}&setPassword=true`,
        },
      });

      return res.http200(user);
    })
  );

router.param(
  'userId',
  asyncMiddleware(async (req, res, next, userId) => {
    const user = await Users.$$findByPk({ id: +userId });
    await user.setRolesAndPermissions();
    req.extractedUser = user;
    next();
  })
);

router
  .route(`/:userId${regex.alphanumericWithAtLeastOneNumber}`)
  .get(
    asyncMiddleware(async (req, res) => {
      if (req.user.dataValues.isAdmin) {
        return res.http200(req.extractedUser);
      }

      if (req.user.id !== req.extractedUser.id) {
        throw "You don't have access to view this profile!";
      }
      return res.http200(req.extractedUser);
    })
  )
  .put(
    asyncMiddleware(async (req, res) => {
      delete req.body.id;
      const updatedUser = await req.extractedUser.update(req.body);
      return res.http200(updatedUser);
    })
  )
  .delete(
    [hasPermission(PERMISSIONS.customersDelete)],
    asyncMiddleware(async (req, res) => {
      await Users.destroy({
        where: { id: req.params.userId },
      });
      return res.http200('Deleted user successfully!');
    })
  );

router.put(
  '/:userId/change-email',
  [hasPermission(PERMISSIONS.customersEdit)],
  asyncMiddleware(async (req, res) => {
    const { email } = req.body;
    const findUserAgainstEmail = await Users.$$findOne({
      query: {
        where: {
          email,
        },
      },
      throwError: false,
    });

    if (findUserAgainstEmail) {
      return res.http500('Email already exist!');
    }

    const user = await Users.$$findOne({
      query: {
        where: {
          id: req.params.userId,
        },
      },
    });

    const updatedUser = user.update({
      email,
    });

    return res.http200(updatedUser);
  })
);

router.route('/:userId/change-password').put(
  [
    oldPasswordValidator,
    passwordChangeValidator,
    newAndConfirmPasswordValidator,
  ],
  asyncMiddleware(async (req, res) => {
    const user = await Users.$$findByPk({ id: +req.params.userId });
    const updatedUser = await user.update({
      password: req.body.newPassword,
    });
    return res.http200(updatedUser);
  })
);

router.get(
  '/:userId/reservations',
  [hasPermission(PERMISSIONS.usersJobs)],
  asyncMiddleware(async (req, res) => {
    const userId = req.params.userId;

    let {
      search = '',
      isPaid,
      isCompleted,
      fromDate,
      toDate,
    } = req.query;

    if (search.match(Regex.reservation)) {
      search = search.toUpperCase().replace('A', '');
    }

    const likeObject = {
      [Sequelize.Op.like]: `${search}%`,
    };

    const where = {
      driverId: userId,
    };

    if (isPaid) {
      where.isPaid = isPaid;
    }

    const innerWhere = {
      [Sequelize.Op.or]: [
        'id',
        'pickUpLocation',
        'dropOffLocation',
        'amount',
        'miles',
      ].map((key) => ({ [key]: likeObject })),
    };

    if (req.extractedUser.isDriver) {
      innerWhere.status = {
        [Sequelize.Op.ne]: 'cancelled',
      };
    }

    if (isCompleted) {
      const value = isCompleted;
      if (value) {
        innerWhere.status = 'completed';
      } else {
        innerWhere.status = {
          [Sequelize.Op.ne]: 'completed',
        };
      }
    }

    if (toDate) {
      innerWhere.pickUpDateTime = {
        [Sequelize.Op.between]: [fromDate, toDate],
      };
    }

    const query = {
      ...req.query,
      where,
      order: sequelizeConfig.Order.Desc(),
      include: [
        {
          model: Reservations,
          as: Reservations.$$singularName,
          where: innerWhere,
        },
      ],
    };
    const reservations = await ReservationDetails.findAndCountAll(
      query
    );
    res.http200(reservations.rows, { count: reservations.count });
  })
);

router
  .route('/:userId/user-attachments')
  .get(
    [hasPermission(PERMISSIONS.usersAttachments)],
    asyncMiddleware(async (req, res) => {
      const userId = req.params.userId;
      const attachments = await UserAttachments.findAndCountAll({
        where: {
          userId,
        },
      });
      res.http200(attachments.rows, { count: attachments.count });
    })
  )
  .post(
    [hasPermission(PERMISSIONS.usersAttachments)],
    asyncMiddleware(async (req, res) => {
      const userId = req.params.userId;
      const { expDate, documentType } = req.query;
      const file = req.file;
      file.name = file.originalname;
      const obj = await uploadFile(file);
      const result = await UserAttachments.create({
        userId,
        type: documentType,
        expiresOn: expDate,
        imageUrl: obj.Location,
        key: obj.Key,
      });
      res.http200(result);
    })
  );

router.delete(
  '/user-attachments/:attachmentId/:attachmentKey',
  [hasPermission(PERMISSIONS.usersAttachments)],
  asyncMiddleware(async (req, res) => {
    const id = req.params.attachmentId;
    const key = req.params.attachmentKey;
    await UserAttachments.destroy({
      where: { id: id },
    });
    deleteFile(key).catch();
    return res.http200('Deleted user attachment successfully!');
  })
);
router.post(
  '/create-user-and-assign-roles',
  [hasPermission(PERMISSIONS.usersEdit)],
  asyncMiddleware(async (req, res) => {
    const password = generateRandomPassword();
    const user = await Users.create({
      ...req.body,
      password,
    });
    const token = user.createToken();
    await user.update({ token: token });
    SendMail('set-password', {
      to: user.email,
      subject: `Set your password at ${process.env.APP_NAME_SPACED}!`,
      variables: {
        userName: user.fullName,
        url: `${process.env.FE_URL}/reset-password?token=${token}&setPassword=true`,
      },
    });
    return res.http200(user);
  })
);

export default router;

('use strict');

const { io } = global;
import asyncMiddleware from '~/server/middlewares/response/async-middleware.js';
import {
  getHashedPassword,
  decodeAPiToken,
} from '~/server/lib/common.js';
import db from '~/server/models/index.js';
const {
  Users,
  Reservations,
  UserRoles,
  RolePermissions: RolePermissionsModel,
  Roles,
  Permissions,
} = db;
import {
  Permissions as AllPermissions,
  RolePermissions,
} from '../../../permissions';
import _ from 'lodash';
import sequelizeOp from 'sequelize';
const { Op } = sequelizeOp;
const { startCase, differenceBy, intersectionBy } = _;
import {
  GetClientToken,
  GetTransactionDetail,
} from '../../../lib/braintree.js';
import { Errors } from '~/server/en.js';
import SendMail from '../../../lib/email-sender/index.js';
import { newAndConfirmPasswordValidator } from '../../../middlewares/password.js';
import hasPermission from '../../../middlewares/has-permission.js';
import { PERMISSIONS } from '../../../permissions.js';

import express from 'express';

const router = express.Router();

router.post(
  '/login',
  asyncMiddleware(async (req, res) => {
    const { email, password } = req.body;
    const user = await Users.$$findOne({
      query: {
        where: {
          email,
          password: getHashedPassword(password),
          isCreatedAtReservation: false,
        },
      },
      error: Errors.SignIn.IncorrectEmailPassword,
    });

    await user.setRolesAndPermissions();

    res.http200({
      token: user.createToken(),
      user,
    });
  })
);

router.post(
  '/signup',
  asyncMiddleware(async (req, res) => {
    const { email } = req.body;
    let user;
    const existingUser = await Users.$$findOne({
      query: {
        where: {
          email,
          isCreatedAtReservation: true,
        },
      },
      throwError: false,
    });

    if (existingUser && existingUser.isCreatedAtReservation) {
      delete req.body.email;

      user = await existingUser.update({
        ...req.body,
        isCreatedAtReservation: false,
      });
    } else {
      user = await Users.create({ ...req.body });
      const userRole = await Roles.$$findOne({
        query: {
          where: {
            name: 'customer',
          },
        },
      });

      await UserRoles.create({
        roleId: userRole.id,
        userId: user.dataValues.id,
      });
    }

    await user.setRolesAndPermissions();
    res.http200({ token: user.createToken(), user });
  })
);

router.get(
  '/me',
  asyncMiddleware(async (req, res) => {
    await req.user.setRolesAndPermissions();
    res.http200({
      user: req.user,
    });
  })
);

router.get(
  '/initialize-braintree',
  asyncMiddleware(async (req, res) => {
    return res.http200({ token: await GetClientToken() });
  })
);

router.post(
  '/signout-user',
  asyncMiddleware(async (req, res) => {
    io.emit('signoutUser');
    return res.http200('yes');
  })
);

router.post(
  '/forgot-password',
  [hasPermission(PERMISSIONS.usersChangePassword)],
  asyncMiddleware(async (req, res) => {
    const { email } = req.body;
    const user = await Users.$$findOne({
      query: {
        where: {
          email,
          isCreatedAtReservation: false,
        },
      },
    });
    const token = user.createToken();
    await user.update({ token: token });
    SendMail('forgot-password', {
      to: email,
      subject: "Forgot Your Password? Let's get you a new one.",
      variables: {
        userName: user.fullName,
        url: `${process.env.FE_URL}/reset-password?token=${token}`,
      },
    });

    res.http200('Mail sent successfully!');
  })
);

router.post(
  '/verify-token',
  asyncMiddleware(async (req, res) => {
    const { token } = req.body;
    const user = await getUserFromToken(token);
    if (token == user.token) {
      return res.http200('Token verified');
    }
    return res.http500('Token unverified');
  })
);

router.post(
  '/verify-email',
  asyncMiddleware(async (req, res) => {
    const { token } = req.body;
    const user = await getUserFromToken(token);
    if (token == user.token) {
      await user.update({
        email: user.tempEmail,
        token: '',
        tempEmail: '',
      });
      return res.http200('Email verified!');
    }
    return res.http500('Email unverified!');
  })
);

router.put(
  '/reset-password',
  [
    newAndConfirmPasswordValidator,
    hasPermission(PERMISSIONS.usersChangePassword),
  ],
  asyncMiddleware(async (req, res) => {
    const { token, confirmPassword } = req.body;
    const user = await getUserFromToken(token);

    const updatedUser = await user.update({
      password: confirmPassword,
      token: '',
    });
    return res.http200(updatedUser);
  })
);

router.post(
  '/verify-password',
  asyncMiddleware(async (req, res) => {
    const { password } = req.user;
    if (password === getHashedPassword(req.body.password)) {
      return res.http200('Password verified!');
    }
    res.http500('Password incorrect!');
  })
);

router.post(
  '/change-email',
  [hasPermission(PERMISSIONS.usersChangeEmail)],
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

    const user = req.user;
    const token = user.createToken();
    await user.update({ token: token, tempEmail: email });

    SendMail('change-email', {
      to: email,
      subject: "Want to change email? Let's register new one.",
      variables: {
        userName: user.fullName,
        url: `${process.env.FE_URL}/verify-email?token=${token}`,
      },
    });

    res.http200('Mail sent successfully!');
  })
);

// Not used anywhere, these are just for testing through postman
router.get(
  '/transaction/:transactionId',
  asyncMiddleware(async (req, res) => {
    const result = await GetTransactionDetail(
      req.params.transactionId
    );
    return res.http200(result);
  })
);

router.route('/test-email').post(
  asyncMiddleware(async (req, res) => {
    try {
      SendMail('test-email', {
        to: req.body.email || 'sajjad.ali5112@gmail.com',
        subject: 'Testing Email',
      });

      return res.http200(true);
    } catch (e) {
      return res.http500(e);
    }
  })
);
router.post(
  '/roles-and-permissions-crud',
  asyncMiddleware(async (req, res) => {
    let existingPermissions = await Permissions.findAll();
    existingPermissions = existingPermissions.map(
      (i) => i.dataValues
    );

    const allPermissions = AllPermissions.map((item) => ({
      name: item,
    }));
    const permissionsToCreate = differenceBy(
      allPermissions,
      existingPermissions,
      'name'
    );

    const newPermissionsAdded = await Permissions.$$bulkCreate(
      permissionsToCreate
    );

    // Permissions are found which are to be removed
    let permissionsToDelete = differenceBy(
      existingPermissions,
      allPermissions,
      'name'
    );

    permissionsToDelete = permissionsToDelete.map((p) => p.id);

    Permissions.destroy({
      where: {
        id: {
          [Op.in]: permissionsToDelete,
        },
      },
    });

    existingPermissions = [
      ...existingPermissions,
      ...newPermissionsAdded,
    ];

    existingPermissions = existingPermissions.filter(
      (permission) => !permissionsToDelete.includes(permission.id)
    );

    let roles = [];
    let existingRoles = await Roles.findAll();
    existingRoles = existingRoles.map((i) => {
      return { name: i.dataValues.name };
    });
    roles = RolePermissions.map((i) => {
      return { name: i.role };
    });

    const newRoles = differenceBy(roles, existingRoles, 'name');
    await Roles.$$bulkCreate(newRoles);

    RolePermissions.forEach(async (rolePermission) => {
      const role = await Roles.findOne({
        where: {
          name: rolePermission.role,
        },
        include: [
          {
            model: Permissions,
            as: Permissions.$$name,
          },
        ],
      });

      const existingRolePermissions = role.dataValues.Permissions.map(
        (permission) => ({
          roleId: role.dataValues.id,
          permissionId: permission.dataValues.id,
          name: permission.dataValues.name,
        })
      );

      let allRolePermissions = rolePermission.permissions.map(
        (p) => ({
          name: p,
        })
      );

      let rolePermissionsToCreate = differenceBy(
        allRolePermissions,
        existingRolePermissions,
        'name'
      );

      if (rolePermissionsToCreate.length) {
        rolePermissionsToCreate = intersectionBy(
          existingPermissions,
          rolePermissionsToCreate,
          'name'
        );

        rolePermissionsToCreate.forEach((rpToCreate) => {
          RolePermissionsModel.create({
            roleId: role.dataValues.id,
            permissionId: rpToCreate.id,
          });
        });
      }

      const rolePermissionsToDelete = differenceBy(
        existingRolePermissions,
        allRolePermissions,
        'name'
      );

      rolePermissionsToDelete.forEach((rpToDelete) => {
        RolePermissionsModel.destroy({
          where: {
            roleId: rpToDelete.roleId,
            permissionId: rpToDelete.permissionId,
          },
        });
      });
    });
    io.emit('onPermissionChange');
    return res.http200('Success');
  })
);

export default router;

async function getUserFromToken(token) {
  const decodedToken = await decodeAPiToken(token);
  const user = await Users.$$findOne({
    query: {
      where: {
        email: decodedToken.email,
      },
    },
  });
  return user;
}

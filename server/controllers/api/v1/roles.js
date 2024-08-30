import asyncMiddleware from '~/server/middlewares/response/async-middleware.js';
import { sequelizeConfig } from '../../../lib/sequelize.js';
import hasPermission from '../../../middlewares/has-permission.js';
import db from '~/server/models/index.js';
const { Roles, Sequelize, Permissions, Users, UserRoles } = db;
import { PERMISSIONS } from '../../../permissions.js';
import { Roles as RolesEnum } from '~/server/enums.js';
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
            name: likeObject,
          },
        ];
      }

      const roles = await Roles.findAndCountAll(query);
      return res.http200(roles.rows, { count: roles.count });
    })
  )
  .post(
    [hasPermission(PERMISSIONS.rolesCreate)],
    asyncMiddleware(async (req, res) => {
      delete req.body.id;
      const role = await Roles.create(req.body);
      return res.http200(role);
    })
  );

router.param(
  'roleId',
  asyncMiddleware(async (req, res, next, roleId) => {
    const role = await Roles.$$findByPk({ id: +roleId });
    req.role = role;
    next();
  })
);
router.get(
  '/users',
  [hasPermission(PERMISSIONS.userRolesView)],
  asyncMiddleware(async (req, res) => {
    const userRoles = await Users.findAll({
      include: [
        {
          model: Roles,
          as: Roles.$$name,
          where: {
            name: {
              [Sequelize.Op.ne]: RolesEnum.superAdmin,
            },
          },
        },
      ],
    });
    return res.http200(userRoles);
  })
);

router.post(
  '/users/:userId',
  [hasPermission(PERMISSIONS.rolesAssign)],
  asyncMiddleware(async (req, res) => {
    const userId = req.params.userId;
    await UserRoles.destroy({
      where: { userId: userId },
      paranoid: false,
    });

    let userRole = req.body.map((item) => {
      return {
        roleId: item,
        userId,
      };
    });

    userRole = await UserRoles.$$bulkCreate(userRole);

    return res.http200(userRole);
  })
);

router.get(
  '/role-permissions',
  [hasPermission(PERMISSIONS.rolePermissionsView)],
  asyncMiddleware(async (req, res) => {
    const userRoles = await Roles.findAll({
      include: [
        {
          model: Permissions,
          as: Permissions.$$name,
        },
      ],
    });
    return res.http200(userRoles);
  })
);

router
  .route('/:roleId')
  .get(
    [hasPermission(PERMISSIONS.rolesView)],
    asyncMiddleware(async (req, res) => {
      res.http200(req.role);
    })
  )
  .put(
    [hasPermission(PERMISSIONS.rolesEdit)],
    asyncMiddleware(async (req, res) => {
      delete req.body.id;
      const roleUpdated = await req.role.update(req.body);
      return res.http200(roleUpdated);
    })
  )
  .delete(
    [hasPermission(PERMISSIONS.rolesDelete)],
    asyncMiddleware(async (req, res) => {
      const ids = [...(req.query.ids || []), req.params.roleId];
      await Roles.destroy({ where: { id: ids } });
      return res.http200('Deleted Role successfully!');
    })
  );

export default router;

const { io } = global;
import asyncMiddleware from '~/server/middlewares/response/async-middleware.js';
import { sequelizeConfig } from '../../../lib/sequelize.js';
import hasPermission from '../../../middlewares/has-permission.js';
import db from '~/server/models/index.js';
const { Permissions, Sequelize, RolePermissions } = db;
import { PERMISSIONS } from '../../../permissions.js';
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

      const permissions = await Permissions.findAndCountAll(query);
      return res.http200(permissions.rows, {
        count: permissions.count,
      });
    })
  )
  .post(
    [hasPermission(PERMISSIONS.permissionsCreate)],
    asyncMiddleware(async (req, res) => {
      delete req.body.id;
      const permission = await Permissions.create(req.body);
      return res.http200(permission);
    })
  );

router.param(
  'permissionId',
  asyncMiddleware(async (req, res, next, permissionId) => {
    const permission = await Permissions.$$findByPk({
      id: +permissionId,
    });
    req.permission = permission;
    next();
  })
);

router
  .route('/:permissionId')
  .put(
    [hasPermission(PERMISSIONS.permissionsEdit)],
    asyncMiddleware(async (req, res) => {
      delete req.body.id;
      const permissionUpdated = await req.permission.update(req.body);
      io.emit('onPermissionChange');
      return res.http200(permissionUpdated);
    })
  )
  .delete(
    [hasPermission(PERMISSIONS.permissionsDelete)],
    asyncMiddleware(async (req, res) => {
      const ids = [...(req.query.ids || []), req.params.permissionId];
      await Permissions.destroy({ where: { id: ids } });
      return res.http200('Deleted Permission successfully!');
    })
  );

router
  .get(
    '/role/:roleId',
    [hasPermission(PERMISSIONS.rolesView)],
    asyncMiddleware(async (req, res) => {
      const permissions = await RolePermissions.findAll({
        include: [
          {
            model: Permissions,
            as: Permissions.$$singularName,
          },
        ],
        where: {
          roleId: req.params.roleId,
        },
      });
      return res.http200(permissions);
    })
  )
  .post(
    '/:roleId',
    [hasPermission(PERMISSIONS.rolesAssign)],
    asyncMiddleware(async (req, res) => {
      const roleId = req.params.roleId;
      await RolePermissions.destroy({
        where: { roleId: roleId },
        paranoid: false,
      });

      let rolePermissions = req.body.map((item) => {
        return {
          permissionId: item,
          roleId,
        };
      });

      rolePermissions = await RolePermissions.$$bulkCreate(
        rolePermissions
      );
      io.emit('onPermissionChange');
      return res.http200(roleId);
    })
  )
  .post(
    '/:permissionId/assign-to-roles',
    [hasPermission(PERMISSIONS.permissionsAssign)],
    asyncMiddleware(async (req, res) => {
      const permissionId = req.params.permissionId;
      await RolePermissions.destroy({
        where: { permissionId: permissionId },
        paranoid: false,
      });

      let rolePermissions = req.body.map((item) => {
        return {
          roleId: item,
          permissionId,
        };
      });

      rolePermissions = await RolePermissions.$$bulkCreate(
        rolePermissions
      );
      io.emit('onPermissionChange');
      return res.http200(permissionId);
    })
  );

export default router;

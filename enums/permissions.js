import _ from "lodash";

function formatObject(obj) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[_.camelCase(key)] = _.kebabCase(value);
    return acc;
  }, {});
}

const SysActions = Object.freeze(
  formatObject({
    create: "create",
    delete: "delete",
    edit: "edit",
    view: "view",
    viewImage: "view-image",
    addQueue: "add-queue",
    addAddon: "add-addon",
    assign: "assign",
    cancel: "cancel",
    changeStatus: "changeStatus",
    complete: "complete",
    createWithinSixHours: "create-within-six-hours",
    createWithinTwentyFourHours: "create-within-twenty-four-hours",
    createWithoutPayment: "create-without-payment",
    deleteAddon: "delete-addon",
    pointToPoint: "point-to-point",
    searchAffiliate: "search-affiliate",
    searchUser: "search-user",
    userJob: "user-job",
    configurationsExtraStop: "configurations:extra-stop",
    configurationsHome: "configurations:home",
    configurationsMaxMilesSurge: "configurations:max-miles-surge",
    configurationsMeetAndGreet: "configurations:meet-and-greet",
    configurationsMessages: "configurations:messages",
    changePassword: "change-password",
    changeEmail: "change-email",
    profileInfo: "profile-info",
    attachments: "attachments",
    duplicate: "duplicate",
  })
);

const SysEntities = Object.freeze(
  formatObject({
    users: "users",
    addons: "addons",
    affiliates: "affiliates",
    cars: "cars",
    customers: "customers",
    discounts: "discounts",
    drivers: "drivers",
    permissions: "permissions",
    reservations: "reservations",
    rolePermissions: "role-permissions",
    roles: "roles",
    settings: "settings",
    surges: "surges",
    vehicles: "vehicles",
    configurations: "configurations",
    staticPageEditor: "static-page-editor",
    userRoles: "user-roles",
  })
);

const SysCrudActions = Object.freeze([
  SysActions.create,
  SysActions.delete,
  SysActions.edit,
  SysActions.view,
  SysActions.addQueue,
]);

const PERMISSIONS = {
  [SysEntities.users]: [
    ...SysCrudActions,
    SysActions.changePassword,
    SysActions.changeEmail,
    SysActions.profileInfo,
    SysActions.attachments,
    SysActions.userJobs,
  ],
  [SysEntities.addons]: [...SysCrudActions],
  [SysEntities.affiliates]: [...SysCrudActions],
  [SysEntities.cars]: [...SysCrudActions, SysActions.viewImage],
  [SysEntities.customers]: [...SysCrudActions],
  [SysEntities.discounts]: [...SysCrudActions],
  [SysEntities.drivers]: [...SysCrudActions],
  [SysEntities.permissions]: [...SysCrudActions],
  [SysEntities.rolePermissions]: [...SysCrudActions],
  [SysEntities.roles]: [...SysCrudActions],
  [SysEntities.settings]: [...SysCrudActions],
  [SysEntities.surges]: [...SysCrudActions],
  [SysEntities.vehicles]: [...SysCrudActions],
  [SysEntities.configurations]: [
    ...SysCrudActions,
    SysActions.configurationsExtraStop,
    SysActions.configurationsHome,
    SysActions.configurationsMaxMilesSurge,
    SysActions.configurationsMeetAndGreet,
    SysActions.configurationsMessages,
  ],
  [SysEntities.staticPageEditor]: [...SysCrudActions],
  [SysEntities.userRoles]: [...SysCrudActions],
  [SysEntities.reservations]: [
    ...SysCrudActions,
    SysActions.addAddon,
    SysActions.assign,
    SysActions.cancel,
    SysActions.changeStatus,
    SysActions.complete,
    SysActions.createWithinSixHours,
    SysActions.createWithinTwentyFourHours,
    SysActions.createWithoutPayment,
    SysActions.deleteAddon,
    SysActions.pointToPoint,
    SysActions.searchAffiliate,
    SysActions.searchUser,
    SysActions.duplicate,
  ],
};

export { PERMISSIONS, SysEntities, SysActions, SysCrudActions };

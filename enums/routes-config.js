import {
    AddonMeta,
    SurgeMeta,
    CarMeta,
    CustomerMeta,
    DiscountCodeMeta,
    DriverMeta,
    HomeMeta,
    ReservationMeta,
    RoleMeta,
    PermissionMeta,
    staticPageEditorMeta,
    AffiliateMeta,
    UsersWithRoles,
} from './meta';

import { PERMISSIONS } from './permissions';

export const RoutesConfig = (() => {
    const routesConfig = {
        default: {
            path: '/',
            meta: {
                ...HomeMeta,
            },
        },
        home: {
            path: '/home',
            redirect: '/',
            meta: {
                ...HomeMeta,
            },
        },
        staticPages: {
            path: '/:slug',
            meta: {},
        },
        forgotPassword: {
            path: '/forgot-password',
            meta: {},
        },
        userProfile: {
            path: '/users',
            meta: {},
            children: {
                profileInfo: {
                    path: ':userId/profile-info',
                    meta: {},
                },
                userAttachments: {
                    path: ':userId/user-attachments',
                    meta: {},
                },
                changePassword: {
                    path: ':userId/change-password',
                    meta: {},
                },
                changeEmail: {
                    path: ':userId/change-email',
                    meta: {},
                },
                userReservations: {
                    path: ':userId/user-reservations',
                    meta: {},
                },
            },
        },
        settings: {
            path: '/settings',
            rolesPath: '/settings/roles',
            configurationPath: '/settings/configurations',
            meta: {},
            children: {
                roles: {
                    path: 'roles',
                    meta: {
                        ...RoleMeta,
                    },
                },
                permissions: {
                    path: 'permissions',
                    meta: {
                        ...PermissionMeta,
                    },
                },
                usersWithRoles: {
                    path: 'users-with-roles',
                    meta: {
                        ...UsersWithRoles,
                    },
                },
                configurations: {
                    path: 'configurations',
                    meta: {},
                },
            },
        },
        verifyEmail: {
            path: '/verify-email',
            meta: {},
        },
        resetPassword: {
            path: '/reset-password',
            meta: {},
        },
        staticPageEditor: {
            path: '/static-pages',
            meta: {
                ...staticPageEditorMeta,
                permission: PERMISSIONS.staticPageEditorView,
            },
        },
        reservationDetails: {
            path: '/reservation/details/:reservationId',
            meta: {},
        },
        reservationCreate: {
            path: '/reservation/create',
            meta: {},
        },
        reservationUpdate: {
            path: '/reservation/update/:reservationId',
            meta: {},
        },
        reservations: {
            path: '/reservations',
            meta: {
                ...ReservationMeta,
                permission: PERMISSIONS.reservationsView,
            },
        },
        cars: {
            path: '/cars',
            meta: {
                ...CarMeta,
                permission: PERMISSIONS.carsView,
            },
        },
        surges: {
            path: '/surges',
            meta: {
                ...SurgeMeta,
                permission: PERMISSIONS.surgesView,
            },
        },
        discountCodes: {
            path: '/discount-codes',
            meta: {
                ...DiscountCodeMeta,
                permission: PERMISSIONS.discountCodesView,
            },
        },
        addons: {
            path: '/addons',
            meta: {
                ...AddonMeta,
                permission: PERMISSIONS.addonsView,
            },
        },
        customers: {
            path: '/customers',
            meta: {
                ...CustomerMeta,
                permission: PERMISSIONS.customersView,
            },
        },
        drivers: {
            path: '/drivers',
            meta: {
                ...DriverMeta,
                permission: PERMISSIONS.driversView,
            },
        },
        affiliates: {
            path: '/affiliates',
            meta: {
                ...AffiliateMeta,
                permission: PERMISSIONS.affiliatesView,
            },
        },
    };

    Object.keys(routesConfig).forEach((key) => {
        routesConfig[key].name = key;
    });

    return routesConfig;
})();

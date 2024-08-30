const permissions = [
    'addons:create',
    'addons:delete',
    'addons:edit',
    'addons:view',
    'affiliates:create',
    'affiliates:delete',
    'affiliates:edit',
    'affiliates:view',
    'cars:create',
    'cars:delete',
    'cars:edit',
    'cars:view',
    'cars:view-image',
    'configurations:extra-stop',
    'configurations:home',
    'configurations:max-miles-surge',
    'configurations:meet-and-greet',
    'configurations:messages',
    'configurations:view',
    'customers:create',
    'customers:delete',
    'customers:edit',
    'customers:view',
    'discountCodes:create',
    'discountCodes:delete',
    'discountCodes:edit',
    'discountCodes:view',
    'drivers:view',
    'reservations:addAddon',
    'reservations:assign',
    'reservations:cancel',
    'reservations:change-status',
    'reservations:complete',
    'reservations:create',
    'reservations:create-withIn-six-hours',
    'reservations:create-withIn-twenty-four-hours',
    'reservations:create-without-payment',
    'reservations:delete',
    'reservations:deleteAddon',
    'reservations:details',
    'reservations:draft',
    'reservations:duplicate',
    'reservations:edit',
    'reservations:point-to-point',
    'reservations:search-affiliate',
    'reservations:search-user',
    'reservations:view',
    'staticPageEditor:create',
    'staticPageEditor:view',
    'surges:create',
    'surges:delete',
    'surges:edit',
    'surges:view',
    'users:attachments',
    'users:change-email',
    'users:change-password',
    'users:edit',
    'users:jobs',
    'users:profile-info',
    'drivers:create',
    'drivers:delete',
    'drivers:edit',
];

module.exports = {
    up: (queryInterface) =>
        queryInterface.bulkInsert(
            'permissions',
            permissions.map((item) => ({
                name: item,
                created_at: new Date(),
                updated_at: new Date(),
            })),
            {}
        ),

    down: (queryInterface) =>
        queryInterface.bulkDelete(
            'permissions',
            permissions.map((item) => ({
                name: item,
                created_at: new Date(),
                updated_at: new Date(),
            })),
            {}
        ),
};

// module.exports = {
//     up: (queryInterface) =>
//         queryInterface.bulkInsert(
//             'permissions',
//             [
//                 {
//                     name: 'addons:create',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'addons:delete',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 { name: 'addons:edit', created_at: new Date(), updated_at: new Date() },
//                 { name: 'addons:view', created_at: new Date(), updated_at: new Date() },
//                 {
//                     name: 'affiliates:create',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'affiliates:delete',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'affiliates:edit',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'affiliates:view',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 { name: 'cars:create', created_at: new Date(), updated_at: new Date() },
//                 { name: 'cars:delete', created_at: new Date(), updated_at: new Date() },
//                 { name: 'cars:edit', created_at: new Date(), updated_at: new Date() },
//                 { name: 'cars:view', created_at: new Date(), updated_at: new Date() },
//                 { name: 'cars:view-image', created_at: new Date(), updated_at: new Date() },
//                 {
//                     name: 'configurations:extra-stop',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'configurations:home',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'configurations:max-miles-surge',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'configurations:meet-and-greet',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'configurations:messages',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'customers:change-email',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'customers:change-password',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'customers:create',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'customers:delete',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'customers:edit',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'customers:profile-info',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'customers:view',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'discountCodes:create',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'discountCodes:delete',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'discountCodes:edit',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'discountCodes:view',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'drivers:attachments',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'drivers:change-email',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'drivers:change-password',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'drivers:create',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'drivers:delete',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'drivers:edit',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'drivers:profile-info',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'drivers:view',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:addAddon',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:assign',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:cancel',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:complete',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:create',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:draft',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:duplicate',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:edit',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:search-affliate',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:search-user',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:view',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:details',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:create-withIn-six-hours',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:create-withIn-twenty-four-hours',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:point-to-point',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:duplicate',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:search-affiliate',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'staticPageEditor:create',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'staticPageEditor:edit',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'staticPageEditor:view',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'surges:create',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'surges:delete',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 { name: 'surges:edit', created_at: new Date(), updated_at: new Date() },
//                 { name: 'surges:view', created_at: new Date(), updated_at: new Date() },
//                 {
//                     name: 'users:attachments',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'users:change-email',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'users:change-password',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 { name: 'users:edit', created_at: new Date(), updated_at: new Date() },
//                 {
//                     name: 'users:profile-info',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 { name: 'users:jobs', created_at: new Date(), updated_at: new Date() },
//                 { name: 'users:Info', created_at: new Date(), updated_at: new Date() },
//                 {
//                     name: 'configurations:view',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//             ],
//             {}
//         ),

//     down: (queryInterface) =>
//         queryInterface.bulkDelete(
//             'permissions',
//             [
//                 {
//                     name: 'addons:create',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'addons:delete',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 { name: 'addons:edit', created_at: new Date(), updated_at: new Date() },
//                 { name: 'addons:view', created_at: new Date(), updated_at: new Date() },
//                 {
//                     name: 'affiliates:create',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'affiliates:delete',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'affiliates:edit',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'affiliates:view',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 { name: 'cars:create', created_at: new Date(), updated_at: new Date() },
//                 { name: 'cars:delete', created_at: new Date(), updated_at: new Date() },
//                 { name: 'cars:edit', created_at: new Date(), updated_at: new Date() },
//                 { name: 'cars:view', created_at: new Date(), updated_at: new Date() },
//                 { name: 'cars:view-image', created_at: new Date(), updated_at: new Date() },
//                 {
//                     name: 'configurations:extra-stop',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'configurations:home',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'configurations:max-miles-surge',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'configurations:meet-and-greet',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'configurations:messages',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'customers:change-email',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'customers:change-password',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'customers:create',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'customers:delete',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'customers:edit',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'customers:profile-info',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'customers:view',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'discountCodes:create',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'discountCodes:delete',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'discountCodes:edit',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'discountCodes:view',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'drivers:attachments',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'drivers:change-email',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'drivers:change-password',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'drivers:create',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'drivers:delete',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'drivers:edit',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'drivers:profile-info',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'drivers:view',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:addAddon',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:assign',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:cancel',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:complete',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:create',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:draft',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:duplicate',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:deleteAddon',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:delete',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:edit',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:search-affliate',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:search-user',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:view',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:details',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:create-withIn-six-hours',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:create-withIn-twenty-four-hours',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:point-to-point',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:duplicate',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'reservations:search-affiliate',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'staticPageEditor:create',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'staticPageEditor:edit',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'staticPageEditor:view',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'surges:create',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'surges:delete',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 { name: 'surges:edit', created_at: new Date(), updated_at: new Date() },
//                 { name: 'surges:view', created_at: new Date(), updated_at: new Date() },
//                 {
//                     name: 'users:attachments',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'users:change-email',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'users:change-password',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 { name: 'users:edit', created_at: new Date(), updated_at: new Date() },
//                 {
//                     name: 'users:profile-info',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 { name: 'users:jobs', created_at: new Date(), updated_at: new Date() },
//                 { name: 'usersInfo', created_at: new Date(), updated_at: new Date() },
//                 {
//                     name: 'configuration:view',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//             ],
//             {}
//         ),
// };

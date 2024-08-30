const roles = ['admin', 'driver', 'customer', 'seo_admin'];
module.exports = {
    up: (queryInterface) =>
        queryInterface.bulkInsert(
            'roles',
            roles.map((item) => ({
                name: item,
                created_at: new Date(),
                updated_at: new Date(),
            })),
            {}
        ),

    down: (queryInterface) =>
        queryInterface.bulkDelete(
            'roles',
            roles.map((item) => ({
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
//             'roles',
//             [
//                 {
//                     name: 'admin',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'driver',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'customer',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'seo_admin',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//             ],
//             {}
//         ),

//     down: (queryInterface) =>
//         queryInterface.bulkDelete(
//             'roles',
//             [
//                 {
//                     name: 'admin',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'driver',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'seo_admin',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//                 {
//                     name: 'customer',
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//             ],
//             {}
//         ),
// };

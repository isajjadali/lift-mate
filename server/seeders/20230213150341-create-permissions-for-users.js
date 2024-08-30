const hashMap = [
    {
        roleId: 1, // Admin
        permissionIds: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
            22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
            40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
            58, 59, 60, 61, 62,
        ],
    },
    {
        roleId: 2, // Driver
        permissionIds: [34, 40, 41, 42, 43, 44, 47, 54, 55, 56, 57, 58, 59],
    },
    {
        roleId: 3, // Customer
        permissionIds: [34, 40, 41, 42, 43, 44, 47, 54, 55, 56, 57, 59],
    },
    {
        roleId: 4, // Seo admin
        permissionIds: [15, 19, 49],
    },
];

module.exports = {
    up: (queryInterface) =>
        Promise.all([
            ...hashMap.map(async (item) =>
                queryInterface.bulkInsert(
                    'role_permissions',
                    getDesiredObjectArray(item.roleId, item.permissionIds),
                    {}
                )
            ),
        ]),

    down: (queryInterface) =>
        Promise.all([
            ...hashMap.map((item) =>
                queryInterface.bulkDelete(
                    'role_permissions',
                    getDesiredObjectArray(item.roleId, item.permissionIds),
                    {}
                )
            ),
        ]),
};

function getDesiredObjectArray(roleId, permissionIds) {
    return permissionIds.map((i) => ({
        role_id: roleId,
        permission_id: i,
        created_at: new Date(),
        updated_at: new Date(),
    }));
}

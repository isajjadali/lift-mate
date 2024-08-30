const hashMap = [
    {
        role_id: '1',
        user_id: '1',
    },
    {
        role_id: '2',
        user_id: '2',
    },
    {
        role_id: '3',
        user_id: '3',
    },
    {
        role_id: '4',
        user_id: '4',
    },
];

module.exports = {
    up: (queryInterface) =>
        queryInterface.bulkInsert(
            'user_roles',
            hashMap.map(item => ({
                ...item,
                created_at: new Date(),
                updated_at: new Date(),
            })),
            {}
        ),

    down: (queryInterface) =>
        queryInterface.bulkDelete(
            'user_roles',
            hashMap.map(item => ({
                ...item,
                created_at: new Date(),
                updated_at: new Date(),
            })),
            {}
        ),
};



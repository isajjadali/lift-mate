module.exports = {
    up: queryInterface => queryInterface.bulkInsert('addons', [
        {
            name: 'Shop',
            percentage: '5',
            amount: '5',
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: 'Restaurant',
            percentage: '10',
            amount: '10',
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
        }, 
        {
            name: 'Grocery',
            percentage: '5',
            amount: '5',
            is_active: true,           
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: 'Medical Store',
            percentage: '10',
            amount: '10',
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
        },

    ], {}),

    down: queryInterface => queryInterface.bulkDelete('addons', [
        {
            name: 'Shop',
            percentage: '5',
            amount: '5',
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: 'Restaurant',
            percentage: '10',
            amount: '10',
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: 'Grocery',
            percentage: '5',
            amount: '5',
            is_active: true,           
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: 'Medical Store',
            percentage: '10',
            amount: '10',
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
        },
    ], {}),
};



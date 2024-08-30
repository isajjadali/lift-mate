module.exports = {
    up: (queryInterface) =>
        queryInterface.bulkInsert(
            'statuses',
            [
                {
                    name: 'draft',
                    type: 'reservation',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'created',
                    type: 'reservation',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'viewed',
                    type: 'reservation',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'assigned',
                    type: 'reservation',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'completed',
                    type: 'reservation',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'cancelled',
                    type: 'reservation',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'unpaid',
                    type: 'reservation',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ],
            {}
        ),

    down: (queryInterface) =>
        queryInterface.bulkDelete(
            'statuses',
            [
                {
                    name: 'draft',
                    type: 'reservation',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'created',
                    type: 'reservation',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'viewed',
                    type: 'reservation',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'assigned',
                    type: 'reservation',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'completed',
                    type: 'reservation',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'cancelled',
                    type: 'reservation',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    name: 'unpaid',
                    type: 'reservation',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ],
            {}
        ),
};



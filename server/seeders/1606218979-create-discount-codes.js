module.exports = {
    up: (queryInterface) =>
        queryInterface.bulkInsert(
            'discount_codes',
            [
                {
                    code: 'f1f2f3',
                    is_active: true,
                    from: '2022-06-02',
                    to: '2022-08-02',
                    percentage: '10',
                    amount: '10',
                    type: 'general',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    code: 'd1d2d3',
                    is_active: true,
                    from: '2022-06-02',
                    to: '2022-08-02',
                    percentage: '20',
                    amount: '20',
                    type: 'general',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    code: 'g1g2g3',
                    is_active: true,
                    from: '2022-06-02',
                    to: '2022-08-02',
                    percentage: '30',
                    amount: '30',
                    type: 'round trip',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    code: 'h1h2h3',
                    is_active: true,
                    from: '2022-06-02',
                    to: '2022-08-02',
                    percentage: '10',
                    amount: '10',
                    type: 'round trip',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ],
            {}
        ),

    down: (queryInterface) =>
        queryInterface.bulkDelete(
            'discount_codes',
            [
                {
                    code: 'f1f2f3',
                    is_active: true,
                    from: '2022-06-02',
                    to: '2022-08-02',
                    percentage: '10',
                    amount: '10',
                    type: 'general',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    code: 'd1d2d3',
                    is_active: true,
                    from: '2022-06-02',
                    to: '2022-08-02',
                    percentage: '20',
                    amount: '20',
                    type: 'general',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    code: 'g1g2g3',
                    is_active: true,
                    from: '2022-06-02',
                    to: '2022-08-02',
                    percentage: '30',
                    amount: '30',
                    type: 'round trip',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    code: 'h1h2h3',
                    is_active: true,
                    from: '2022-06-02',
                    to: '2022-08-02',
                    percentage: '10',
                    amount: '10',
                    type: 'round trip',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ],
            {}
        ),
};



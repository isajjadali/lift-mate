const ReservationDetailsAddonsCommonRequiredKeys = {
    name: { type: 'string' },
    percentage: { type: 'number', isOptional: false },
    amount: { type: 'number', isOptional: false },
    comments: { type: 'string' },
};

module.exports = {
    '/': {
        post: {
            body: { ...ReservationDetailsAddonsCommonRequiredKeys },
        },
    },
    '/:id': {
        put: {
            body: {
                name: {
                    ...ReservationDetailsAddonsCommonRequiredKeys.name,
                    isOptional: true,
                },
                amount: {
                    ...ReservationDetailsAddonsCommonRequiredKeys.amount,
                    isOptional: true,
                },
                percentage: {
                    ...ReservationDetailsAddonsCommonRequiredKeys.percentage,
                    isOptional: true,
                },
                comments: {
                    ...ReservationDetailsAddonsCommonRequiredKeys.comments,
                    isOptional: true,
                },
            },
        },
    },
};

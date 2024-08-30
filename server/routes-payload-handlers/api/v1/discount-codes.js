const DiscountCodeCommonRequiredKeys = {
    type: { type: 'string' },
    from: { type: 'string' },
    to: { type: 'string' },
    percentage: { type: 'number', isOptional: true },
    amount: { type: 'number', isOptional: true },
    isActive: { type: 'boolean', isOptional: true },
};

module.exports = {
    '/': {
        post: {
            body: { ...DiscountCodeCommonRequiredKeys },
        },
    },
    '/:id': {
        put: {
            body: {
                percentage: {
                    ...DiscountCodeCommonRequiredKeys.percentage,
                    isOptional: true,
                },
                from: { ...DiscountCodeCommonRequiredKeys.from, isOptional: true },
                to: { ...DiscountCodeCommonRequiredKeys.to, isOptional: true },
                amount: { ...DiscountCodeCommonRequiredKeys.amount, isOptional: true },
                isActive: {
                    ...DiscountCodeCommonRequiredKeys.isActive,
                    isOptional: true,
                },
            },
        },
    },
};

const AddonsCommonRequiredKeys = {
    name: { type: 'string' },
    amount: { type: 'number', isOptional: true },
    percentage: { type: 'number', isOptional: true },
    isActive: { type: 'boolean', isOptional: true },
};

module.exports = {
    '/': {
        post: {
            body: { ...AddonsCommonRequiredKeys },
        },
    },
    '/:id': {
        put: {
            body: {
                name: { ...AddonsCommonRequiredKeys.name, isOptional: true },
                percentage: {
                    ...AddonsCommonRequiredKeys.percentage,
                    isOptional: true,
                },
                amount: { ...AddonsCommonRequiredKeys.amount, isOptional: true },
                isActive: { ...AddonsCommonRequiredKeys.isActive, isOptional: true },
            },
        },
    },
};

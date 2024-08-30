const SurgesCommonRequireKeys = {
    name: { type: 'string' },
    description: { type: 'string' },
    from: { type: 'string' },
    to: { type: 'string' },
    percentage: { type: 'number', isOptional: true },
    amount: { type: 'number', isOptional: true },
    isActive: { type: 'boolean', isOptional: true },
};
module.exports = {
    '/': {
        post: {
            body: {
                ...SurgesCommonRequireKeys,
            },
        },
    },
    '/:surgeId': {
        put: {
            body: {
                name: {...SurgesCommonRequireKeys.name,isOptional: true,},
                description: {...SurgesCommonRequireKeys.description,isOptional: true,},
                from: { ...SurgesCommonRequireKeys.from, isOptional: true },
                to: { ...SurgesCommonRequireKeys.to, isOptional: true },
                percentage: { ...SurgesCommonRequireKeys.percentage, isOptional: true },
                amount: { ...SurgesCommonRequireKeys.amount, isOptional: true },
                isActive: { ...SurgesCommonRequireKeys.isActive, isOptional: true },
            },
        },
    },
};

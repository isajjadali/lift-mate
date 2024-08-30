const CarsCommonRequiredKeys = {
    name: { type: 'string' },
    toAdd: { type: 'number' },
    toMultiply: { type: 'number' },
    minimumRate: { type: 'number' },
    quantity: { type: 'number' },
    maxPassenger: { type: 'number' },
    maxBags: { type: 'number' },
    isActive: { type: 'boolean', isOptional: true },
    imageUrl: { type: 'string', isOptional: true },
    awsObjectKey: { type: 'string', isOptional: true },
};
module.exports = {
    '/': {
        post: {
            body: { ...CarsCommonRequiredKeys },
        },
    },
    '/:id': {
        put: {
            body: {
                name: { ...CarsCommonRequiredKeys.name, isOptional: true },
                toAdd: { ...CarsCommonRequiredKeys.toAdd, isOptional: true },
                toMultiply: { ...CarsCommonRequiredKeys.toMultiply, isOptional: true },
                minimumRate: {
                    ...CarsCommonRequiredKeys.minimumRate,
                    isOptional: true,
                },
                quantity: { ...CarsCommonRequiredKeys.quantity, isOptional: true },
                maxPassenger: {
                    ...CarsCommonRequiredKeys.maxPassenger,
                    isOptional: true,
                },
                maxBags: { ...CarsCommonRequiredKeys.maxBags, isOptional: true },
                awsObjectKey: {
                    ...CarsCommonRequiredKeys.awsObjectKey,
                    isOptional: true,
                },
                imageUrl: { ...CarsCommonRequiredKeys.imageUrl, isOptional: true },
            },
        },
    },
    '/update-image/:id': {
        put: {
            body: {
                imageUrl: { ...CarsCommonRequiredKeys.imageUrl, isOptional: true },
            },
        },
    },
};

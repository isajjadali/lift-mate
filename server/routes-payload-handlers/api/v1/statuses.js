const statusCommonRequireKeys = {
    name: { type: 'string' },
    type: { type: 'string' },
};
module.exports = {
    '/': {
        post: {
            body: {
                ...statusCommonRequireKeys,
            },
        },
    },
    '/:statusId': {
        put: {
            body: {
                name: { ...statusCommonRequireKeys.name, isOptional: true },
                type: { ...statusCommonRequireKeys.type, isOptional: true },
            },
        },
    },
};

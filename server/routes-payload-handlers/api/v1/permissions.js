const PermissionsCommonRequiredKeys = {
    name: { type: 'string' },
};
module.exports = {
    '/': {
        post: {
            body: { ...PermissionsCommonRequiredKeys },
        },
    },
    '/:id': {
        put: {
            body: {
                name: { ...PermissionsCommonRequiredKeys.name},
            },
        },
    },
};

const AffiliateCommonRequiredKeys = {
    name: { type: 'string' },
};

module.exports = {
    '/': {
        post: {
            body: { ...AffiliateCommonRequiredKeys },
        },
    },
    '/:id': {
        put: {
            body: {
                name: { ...AffiliateCommonRequiredKeys.name, isOptional: false },
            },
        },
    },
};

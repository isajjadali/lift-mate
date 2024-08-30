const StaticPagesCommonRequiredKeys = {
    title: { type: 'string' },
    isActive: { type: 'boolean' },
    content: { type: 'string' },
};

module.exports = {
    '/': {
        post: {
            body: { title: StaticPagesCommonRequiredKeys.title },
        },
    },
    '/:pageId': {
        put: {
            body: {
                title: { ...StaticPagesCommonRequiredKeys.title },
                isActive: {
                    ...StaticPagesCommonRequiredKeys.isActive,
                    isOptional: true,
                },
                content: { ...StaticPagesCommonRequiredKeys.content, isOptional: true },
            },
        },
    },
};

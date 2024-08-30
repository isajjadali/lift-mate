const userAttachmentsCommonRequireKeys = {
    userId: { type: 'number' },
    type: { type: 'string' },
    imageUrl: { type: 'string' },
    key: { type: 'string' },
    expiresOn: { type: 'string' },
};
module.exports = {
    '/:userId/user-attachments': {
        post: {
            body: {
                ...userAttachmentsCommonRequireKeys,
            },
        },
    },
};

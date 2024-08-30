const UserCommonRequiredKeys = {
    email: { type: 'string', isEmail: true },
    firstName: { type: 'string' },
    lastName: { type: 'string', isOptional: true },
    address: { type: 'string', isOptional: true },
    phoneNumber: { type: 'string' },
    phoneType: { type: 'string', isOptional: true },
    allowableKeys: ['email', 'firstName', 'lastName', 'address', 'phoneNumber'],
};

const passwordKeysConfig= { type: 'string', minLength: 8 };
module.exports = {
    '/': {
        post: {
            body: { ...UserCommonRequiredKeys },
        },
    },
    '/:userId': {
        put: {
            body: {
                email: { ...UserCommonRequiredKeys.email, isOptional: true },
                firstName: { ...UserCommonRequiredKeys.firstName, isOptional: true },
                lastName: { ...UserCommonRequiredKeys.lastName, isOptional: true },
                address: { ...UserCommonRequiredKeys.address, isOptional: true },
                phoneNumber: {
                    ...UserCommonRequiredKeys.phoneNumber,
                    isOptional: true,
                },
                phoneType: { ...UserCommonRequiredKeys.phoneType, isOptional: true },
                allowableKeys: [
                    'email',
                    'firstName',
                    'lastName',
                    'address',
                    'phoneNumber',
                    'phoneType',
                ],
            },
        },
    },
    '/:userId/change-password': {
        put: {
            body: {
                newPassword: { ...passwordKeysConfig },
                confirmPassword: { ...passwordKeysConfig },
            },
        },
    },
    '/:userId/change-email': {
        put: {
            body: {
                email: { ...UserCommonRequiredKeys.email },
            },
        },
    },
    '/:userId/user-attachments': {
        post: {
            query: {
                documentType: { type: 'string' },
                expDate: { type: 'string' },
            },
        },
    },
};

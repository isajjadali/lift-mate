const UserCommonRequiredKeys = {
    city: { type: 'string' },
    email: { type: 'string', isEmail: true },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    state: { type: 'string' },
    street: { type: 'string' },
    phoneNumber: { type: 'string' },
    cnic: { type: 'string' },
    dob: { type: 'string' },
    zipCode: { type: 'string' },
    age: { type: 'number' },
    socialSecurityNumber: { type: 'string' },
    phoneType: { type: 'string' },
};
const passwordKeysConfig = { type: 'string', minLength: 8 };

module.exports = {
    login: {
        post: {
            body: {
                email: { ...UserCommonRequiredKeys.email },
                password: { type: 'string' },
            },
        },
    },
    '/signup': {
        post: {
            body: {
                email: { ...UserCommonRequiredKeys.email },
                firstName: { ...UserCommonRequiredKeys.firstName },
                lastName: { ...UserCommonRequiredKeys.lastName, isOptional: true },
                phoneNumber: { ...UserCommonRequiredKeys.phoneNumber },
                password: { ...passwordKeysConfig },
                confirmPassword: { ...passwordKeysConfig },
            },
        },
    },
    '/forgot-password': {
        post: {
            body: {
                email: { ...UserCommonRequiredKeys.email },
            },
        },
    },
    '/reset-password': {
        put: {
            body: {
                confirmPassword: { type: 'string' },
                newPassword: { type: 'string' },
                oldPassword: { type: 'string', isOptional: true },
                token: { type: 'string', isOptional: true },
            },
        },
    },
    '/verify-token': {
        post: {
            body: {
                token: { type: 'string' },
            },
        },
    },
    '/:userId': {
        put: {
            body: {
                email: { ...UserCommonRequiredKeys.email, isOptional: true },
                firstName: { ...UserCommonRequiredKeys.firstName, isOptional: true },
                lastName: { ...UserCommonRequiredKeys.lastName, isOptional: true },
                phoneNumber: {
                    ...UserCommonRequiredKeys.phoneNumber,
                    isOptional: true,
                },
                dob: { ...UserCommonRequiredKeys.dob, isOptional: true },
                socialSecurityNumber: {
                    ...UserCommonRequiredKeys.socialSecurityNumber,
                    isOptional: true,
                },
                phoneType: {
                    ...UserCommonRequiredKeys.phoneType,
                    isOptional: true,
                },
                allowableKeys: [
                    'email',
                    'firstName',
                    'lastName',
                    'phoneNumber',
                    'dob',
                    'socialSecurityNumber',
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
};

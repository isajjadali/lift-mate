const ReservationsCommonRequireKeys = {
    name: { type: 'string' },
    status: { type: 'string' },
    email: { type: 'string', isEmail: true },
    pickUpDateTime: { type: 'string' },
    checkingLocation: { type: 'string' },
    pickUpLocation: { type: 'string' },
    dropOffLocation: { type: 'string' },
    paymentType: { type: 'string', isOptional: true },
    isChildOf: { type: 'number', isOptional: true },
    isParentOf: { type: 'number', isOptional: true },
    affiliateName: { type: 'string', isOptional: true },
    isRoundTrip: { type: 'boolean', isOptional: true },
    isMeetAndGreet: { type: 'boolean', isOptional: true },
    extraMilesAmount: { type: 'number', isOptional: true },
    returnPickUpDateTime: { type: 'string', isOptional: true },
    isBagsChecked: { type: 'boolean', isOptional: true },
    phoneNumber: { type: 'string', isOptional: true },
    noOfPassenger: { type: 'number' },
    flightNumber: { type: 'string', isOptional: true },
    returnFlightNumber: { type: 'string', isOptional: true },
    internationalPhoneNumber: { type: 'string', isOptional: true },
    comments: { type: 'string', isOptional: true },
    gratuity: { type: 'number', isOptional: true },
    customGratuity: { type: 'number', isOptional: true },
    removeableKeys: ['amount', 'totalBill'],
};
module.exports = {
    '/': {
        post: {
            body: {
                ...ReservationsCommonRequireKeys,
            },
        },
    },
    '/:resevationId': {
        put: {
            body: {
                name: { ...ReservationsCommonRequireKeys.name, isOptional: true },
                status: { ...ReservationsCommonRequireKeys.status, isOptional: true },
                email: { ...ReservationsCommonRequireKeys.email, isOptional: true },
                pickUpDateTime: {
                    ...ReservationsCommonRequireKeys.pickUpDateTime,
                    isOptional: true,
                },
                checkingLocation: {
                    ...ReservationsCommonRequireKeys.checkingLocation,
                    isOptional: true,
                },
                pickUpLocation: {
                    ...ReservationsCommonRequireKeys.pickUpLocation,
                    isOptional: true,
                },
                dropOffLocation: {
                    ...ReservationsCommonRequireKeys.dropOffLocation,
                    isOptional: true,
                },
                paymentType: {
                    ...ReservationsCommonRequireKeys.paymentType,
                    isOptional: true,
                },
                isChildOf: {
                    ...ReservationsCommonRequireKeys.isChildOf,
                    isOptional: true,
                },
                isParentOf: {
                    ...ReservationsCommonRequireKeys.isParentOf,
                    isOptional: true,
                },
                affiliateName: {
                    ...ReservationsCommonRequireKeys.affiliateName,
                    isOptional: true,
                },
                isRoundTrip: {
                    ...ReservationsCommonRequireKeys.isRoundTrip,
                    isOptional: true,
                },
                isMeetAndGreet: {
                    ...ReservationsCommonRequireKeys.isMeetAndGreet,
                    isOptional: true,
                },
                isBagsChecked: {
                    ...ReservationsCommonRequireKeys.isBagsChecked,
                    isOptional: true,
                },
                extraMilesAmount: {
                    ...ReservationsCommonRequireKeys.extraMilesAmount,
                    isOptional: true,
                },
                returnPickUpDateTime: {
                    ...ReservationsCommonRequireKeys.returnPickUpDateTime,
                    isOptional: true,
                },
                phoneNumber: {
                    ...ReservationsCommonRequireKeys.phoneNumber,
                    isOptional: true,
                },
                noOfPassenger: {
                    ...ReservationsCommonRequireKeys.noOfPassenger,
                    isOptional: true,
                },
                flightNumber: {
                    ...ReservationsCommonRequireKeys.flightNumber,
                    isOptional: true,
                },
                returnFlightNumber: {
                    ...ReservationsCommonRequireKeys.returnFlightNumber,
                    isOptional: true,
                },
                internationalPhoneNumber: {
                    ...ReservationsCommonRequireKeys.internationalPhoneNumber,
                    isOptional: true,
                },
                comments: {
                    ...ReservationsCommonRequireKeys.comments,
                    isOptional: true,
                },
                gratuity: {
                    ...ReservationsCommonRequireKeys.gratuity,
                    isOptional: true,
                },
                customGratuity: {
                    ...ReservationsCommonRequireKeys.customGratuity,
                    isOptional: true,
                },
            },
        },
    },
};

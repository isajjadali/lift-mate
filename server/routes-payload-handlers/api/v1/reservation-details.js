const ReservationDetailCommonRequiredKeys = {
    reservationId: { type: 'number' },
    carId: { type: 'number' },
    description: { type: 'string' },
    name: { type: 'string' },
    imageUrl: { type: 'string' },
    awsObjectKey: { type: 'string' },
    toAdd: { type: 'number' },
    toMultiply: { type: 'number' },
    minimumRate: { type: 'number' },
    quantity: { type: 'number' },
    maxPassenger: { type: 'number' },
    maxBags: { type: 'number' },
    isActive: { type: 'boolean' },
    requiredCars: { type: 'number' },
    price: { type: 'number' },
};
module.exports = {
    '/': {
        post: {
            body: {
                ...ReservationDetailCommonRequiredKeys,
            },
        },
    },
    '/:ResevationId': {
        put: {
            body: {
                reservationId: {
                    ...ReservationDetailCommonRequiredKeys.reservationId,
                    isOptional: true,
                },
                carId: {
                    ...ReservationDetailCommonRequiredKeys.carId,
                    isOptional: true,
                },
                driverId: {
                    ...ReservationDetailCommonRequiredKeys.driverId,
                    isOptional: true,
                },
                description: {
                    ...ReservationDetailCommonRequiredKeys.description,
                    isOptional: true,
                },
                name: { ...ReservationDetailCommonRequiredKeys.name, isOptional: true },
                imageUrl: {
                    ...ReservationDetailCommonRequiredKeys.imageUrl,
                    isOptional: true,
                },
                toAdd: {
                    ...ReservationDetailCommonRequiredKeys.toAdd,
                    isOptional: true,
                },
                toMultiply: {
                    ...ReservationDetailCommonRequiredKeys.toMultiply,
                    isOptional: true,
                },
                awsObjectKey: {
                    ...ReservationDetailCommonRequiredKeys.awsObjectKey,
                    isOptional: true,
                },
                requiredCars: {
                    ...ReservationDetailCommonRequiredKeys.requiredCars,
                    isOptional: true,
                },
                maxBags: {
                    ...ReservationDetailCommonRequiredKeys.maxBags,
                    isOptional: true,
                },
                maxPassenger: {
                    ...ReservationDetailCommonRequiredKeys.maxPassenger,
                    isOptional: true,
                },
                quantity: {
                    ...ReservationDetailCommonRequiredKeys.quantity,
                    isOptional: true,
                },
                price: {
                    ...ReservationDetailCommonRequiredKeys.price,
                    isOptional: true,
                },
            },
        },
    },
};

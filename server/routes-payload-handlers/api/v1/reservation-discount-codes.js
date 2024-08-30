const ReservationDiscountCodesCommonRequiredKeys = {
    reservationId: { type: 'string' },
    code: { type: 'number' },
    amount: { type: 'number', isOptional: true },
    percentage: { type: 'number', isOptional: true },
    type: { type: 'string' },
};

module.exports = {
    '/': {
        post: {
            body: { ...ReservationDiscountCodesCommonRequiredKeys },
        },
    },
    '/:id': {
        put: {
            body: {
                reservationId: {
                    ...ReservationDiscountCodesCommonRequiredKeys.reservationId,
                    isOptional: true,
                },
                percentage: {
                    ...ReservationDiscountCodesCommonRequiredKeys.percentage,
                    isOptional: true,
                },
                amount: {
                    ...ReservationDiscountCodesCommonRequiredKeys.amount,
                    isOptional: true,
                },
                type: {
                    ...ReservationDiscountCodesCommonRequiredKeys.type,
                    isOptional: true,
                },
                code: {
                    ...ReservationDiscountCodesCommonRequiredKeys.code,
                    isOptional: true,
                },
            },
        },
    },
};

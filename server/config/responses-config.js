export default {
    '200': {
        response: {
            defaults: {
                string: {
                    field: 'message',
                    defaultValue: 'success',
                },
                object: {
                    field: 'data',
                    defaultValue: {},
                    hideIfNotExist: true,
                },
                array: {
                    field: 'dataItems',
                    defaultValue: [],
                    hideIfNotExist: true,
                }
            },
        },
        callback: () => { }
    },
    '500, 400, 401': {
        response: {
            defaults: {
                string: {
                    field: 'error',
                    defaultValue: 'Default Error',
                },
                object: {
                    field: 'error',
                    defaultValue: {},
                    hideIfNotExist: true,
                },
                array: {
                    field: 'errors',
                    defaultValue: [],
                    hideIfNotExist: true,
                }
            },
        },
        callback: () => { }
    },
};

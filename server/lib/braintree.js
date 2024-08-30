import braintree from 'braintree'

let gateway = new braintree.BraintreeGateway({
    environment:
    braintree.Environment[process.env.BRAINTREE_ENVIRONMENT || 'Sandbox'],
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const GetClientToken = async () => {
    return (await gateway.clientToken.generate({})).clientToken;
};

export const ChargeTransactionThroughNonce = async (payload) => {
    const result = await gateway.transaction.sale({
        amount: payload.amount,
        paymentMethodNonce: payload.nonce,
        customer: {
            firstName: payload.name,
            phone: payload.phoneNumber,
            email: payload.email
        },
        options: {
            submitForSettlement: true,
        },
    });

    if (result.success) {
        return result;
    }

    console.error(result);

    throw result;
};
export const ChargeTransactionThroughCustomerId = async (payload) => {
    const result = await gateway.transaction.sale({
        amount: payload.amount,
        customerId: payload.customerId,
        options: {
            submitForSettlement: true,
        },
    });

    if (result.success) {
        return result;
    }

    console.error(result);

    throw result;
};
export const RefundTransaction = async (payload) => {
    try {
        return await gateway.transaction.refund(payload.id, payload.amount);
    } catch (e) {
        console.log(e);
    }
};

export const GetTransactionDetail = async (transactionId) => {
    return await gateway.transaction.void(transactionId);
};

export const getCustomerId = async (transactionId) => {
    await gateway.customer
        .create({
            firstName: 'Jen',
            lastName: 'Smith',
            company: 'Braintree',
            email: 'jen@example.com',
            phone: '312.555.1234',
            fax: '614.555.5678',
            website: 'www.example.com',
        })
        .then((result) => {
            console.log('<<<<<--------------Start-------------------->>>>>');
            console.log(result.success);
            console.log(result.customer.id);
            console.log('<<<<<---------------End--------------------->>>>>');
            console.log(
                result.customer.paymentMethods,
                'result.customer.paymentMethods[0].token;'
            );
            return result.customer.id;
            // e.g. 494019
        });
};

export const CreateTransaction = async (payload) => {
    const result = await gateway.customer.create({
        firstName: 'Jen',
        lastName: 'Smith',
        company: 'Braintree',
        email: 'jen@example.com',
        phone: '312.555.1234',
        fax: '614.555.5678',
        website: 'www.example.com',
    });
    return result;
};

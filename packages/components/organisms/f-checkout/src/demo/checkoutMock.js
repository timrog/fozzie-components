import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

const methods = {
    get: 'get',
    post: 'post',
    patch: 'patch'
};

const responses = {
    ok: 200,
    forbidden: 403,
    serverError: 500,
    timeout: 'timeout'
};

export const checkoutRequests = {
    getCheckoutDelivery: {
        path: '/checkout-delivery.json',
        method: methods.get,
        status: responses.ok
    },
    getCheckoutDeliveryAsap: {
        path: '/checkout-delivery-user-selected-asap.json',
        method: methods.get,
        status: responses.ok
    },
    getCheckoutDeliveryLater: {
        path: '/checkout-delivery-user-selected-later.json',
        method: methods.get,
        status: responses.ok
    },
    getCheckoutDeliveryUnavailable: {
        path: '/checkout-delivery-user-selected-unavailable-time.json',
        method: methods.get,
        status: responses.ok
    },
    getCheckoutCollection: {
        path: '/checkout-collection.json',
        method: methods.get,
        status: responses.ok
    },
    getCheckoutCollectionAsap: {
        path: '/checkout-collection-user-selected-asap.json',
        method: methods.get,
        status: responses.ok
    },
    getCheckoutCollectionLater: {
        path: '/checkout-collection-user-selected-later.json',
        method: methods.get,
        status: responses.ok
    },
    getCheckoutDineIn: {
        path: '/checkout-dinein.json',
        method: methods.get,
        status: responses.ok
    },
    getCheckoutTimeout: {
        path: '/checkout-timeout-get-error.json',
        method: methods.get,
        status: responses.timeout
    },
    getCheckoutAccessForbidden: {
        path: '/checkout-403-get-error.json',
        method: methods.get,
        status: responses.forbidden
    },
    getCheckoutError: {
        path: '/checkout-500-get-error.json',
        method: methods.get,
        status: responses.serverError
    },
    checkoutAvailableFulfilment: {
        path: '/checkout-available-fulfilment.json',
        method: methods.get,
        status: responses.ok
    },
    checkoutAvailableFulfilmentNoTimeAvailable: {
        path: '/checkout-available-fulfilment-no-time-available.json',
        method: methods.get,
        status: responses.ok
    },
    checkoutAvailableFulfilmentPreorder: {
        path: '/checkout-available-fulfilment-preorder.json',
        method: methods.get,
        status: responses.ok
    },
    createGuest: {
        path: '/create-guest.json',
        method: methods.get,
        status: responses.timeout
    },
    getBasketDelivery: {
        path: '/get-basket-delivery.json',
        method: methods.get,
        status: responses.ok
    },
    getBasketCollection: {
        path: '/get-basket-collection.json',
        method: methods.get,
        status: responses.ok
    },
    getBasketDineIn: {
        path: '/get-basket-dinein.json',
        method: methods.get,
        status: responses.ok
    },
    getBasketTimeout: {
        path: '/get-basket-timeout.json',
        method: methods.get,
        status: responses.timeout
    },
    updateCheckout: {
        path: '/update-checkout.json',
        method: methods.patch,
        status: responses.ok
    },
    updateCheckoutRestaurantNotTakingOrders: {
        path: '/update-checkout-restaurant-not-taking-orders.json',
        method: methods.patch,
        status: responses.ok
    },
    updateCheckoutAdditionalItemsRequired: {
        path: '/update-checkout-additional-items-required.json',
        method: methods.patch,
        status: responses.ok
    },
    updateCheckoutAccessForbidden: {
        path: '/update-checkout-403.json',
        method: methods.patch,
        status: responses.forbidden
    },
    updateCheckoutUnavailableTime: {
        path: '/update-checkout-time-unavailable.json',
        method: methods.patch,
        status: responses.ok
    },
    updateCheckoutTimeout: {
        path: '/update-checkout-timeout.json',
        method: methods.patch,
        status: responses.timeout
    },
    getAddress: {
        path: '/get-address.json',
        method: methods.get,
        status: responses.ok
    },
    placeOrder: {
        path: '/place-order.json',
        method: methods.get,
        status: responses.ok
    },
    placeOrderDuplicate: {
        path: '/place-order-duplicate.json',
        method: methods.get,
        status: responses.ok
    },
    placeOrderTimeout: {
        path: '/place-order-timeout.json',
        method: methods.get,
        status: responses.timeout
    },
    getGeoLocation: {
        path: '/get-geo-location.json',
        method: methods.get,
        status: responses.ok
    },
    getCustomer: {
        path: '/get-customer.json',
        method: methods.get,
        status: responses.ok
    }
};

async function testCheckoutSetup ({path, method, status}) {
    const methodName = method.charAt(0).toUpperCase() + method.slice(1);
    const functionName = `on${methodName}`
    const mocked = mock[functionName](path);

    if (status === 'timeout') {
        mocked.timeout();
    } else {
        const payload = await import(`.${path}`);
        mocked.reply(status, payload);
    }
}

function passThroughAny () {
    mock.onAny().passThrough();
}

export async function initialise() {
    console.log('here')
    const props = Object.entries(checkoutRequests);

    for (let i = 0; i < props.length; i++) {
        await testCheckoutSetup(props[i][1]);
    }

    passThroughAny();
}

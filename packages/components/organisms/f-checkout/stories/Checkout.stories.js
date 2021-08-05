import Vue from 'vue';
import Vuex from 'vuex';
import { select, boolean } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { locales } from '@justeat/storybook/constants/globalisation';

import VueCheckout from '../src/components/Checkout.vue';
import fCheckoutModule from '../src/store/checkout.module';
import fCheckoutAnalyticsModule from '../src/store/checkoutAnalytics.module';
import fCheckoutExperimentationModule from '../src/store/checkoutExperimentation.module';
import CheckoutMock, {checkoutRequests, initialise} from '../src/demo/checkoutMock';

Vue.use(Vuex);

const paymentPageUrlPrefix = '#/pay'; // Adding the "#" so we don't get redirect out of the component in Storybook


const restraurantNotTakingOrders = 'Restaurant Not Taking Orders Issue (Response from server but order not fulfillable)';
const additionalItemsRequired = 'Additional Items Required Issue (Response from server but order not fulfillable)';
const updateCheckoutAccessForbidden = 'Access Forbidden (Response from server is 403)';
const checkoutServerError = 'Checkout Error (Response from server is an error)';
const placeOrderError = 'Place Order Duplicate Error (Response from server is an error)';
const accessForbiddenError = 'Access Forbidden Get Checkout Error (Response from server is an error)';
const getCheckoutError = 'Any other Get Checkout Error (Response from server is an error)';
const SERVER = 'SERVER';
const accessForbiddenErrorCode = '403';
const getCheckoutErrorCode = '500';
const noTimeAvailableError = 'No Time Available';
const noTimeAvailable = 'no-time-available';
const restraurantNotTakingOrdersIssue = 'restaurant-not-taking-orders';
const additionalItemsRequiredIssue = 'additional-items-required';
const timeNotAvailable = 'Selected time no longer available';
const timeNotAvailableIssue = 'time-unavailable';
const serverTimeout = 'Server timeout';
const serverTimeoutIssue = 'timeout';
const duplicateIssue = 'duplicate';

const patchCheckoutErrorOptions = {
    None: null,
    [restraurantNotTakingOrders]: restraurantNotTakingOrdersIssue,
    [additionalItemsRequired]: additionalItemsRequiredIssue,
    [checkoutServerError]: SERVER,
    [updateCheckoutAccessForbidden]: accessForbiddenErrorCode,
    [timeNotAvailable]: timeNotAvailableIssue,
    [serverTimeout]: serverTimeoutIssue
};

const getCheckoutErrorOptions = {
    None: null,
    [accessForbiddenError]: accessForbiddenErrorCode,
    [getCheckoutError]: getCheckoutErrorCode,
    [noTimeAvailableError]: noTimeAvailable,
    [serverTimeout]: serverTimeoutIssue
};

const placeOrderErrorOptions = {
    None: null,
    [placeOrderError]: duplicateIssue,
    [serverTimeout]: serverTimeoutIssue
};

const fulfilmentTimeOptions = {
    none: null,
    'Selected Asap Time': 'user-selected-asap',
    'Selected Later Time': 'user-selected-later',
    'Selected Unavailable Time': 'user-selected-unavailable-time'
};

// eslint-disable-next-line
const mockAuthToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.'
    + 'eyJlbWFpbCI6ImpvZS5ibG9nZ3NAanVzdGVhdHRha2Vhd2F5LmNvbS'
    + 'IsImNyZWF0ZWRfZGF0ZSI6IjIwMjEtMDItMDhUMTA6Mjc6NDkuMTkz'
    + 'MDAwMFoiLCJuYW1lIjoiSm9lIEJsb2dncyIsImdsb2JhbF91c2VyX2lkI'
    + 'joiVTdOUkFsV0FnNXpPZHNkUmdmN25rVHlvaTkwWEVvPSIsImdpdmVuX25h'
    + 'bWUiOiJKb2UiLCJmYW1pbHlfbmFtZSI6IkJsb2dncyIsImlhdCI6MTYxNTQ2OTUxNn0.VapH6uHnn4lHIkvN_mS9A9IVVWL0YPNE39gDDD-l7SU';

export const CheckoutComponent = () => ({
    components: { VueCheckout },
    data () {
        return {
            checkoutRequests,
            createGuest: checkoutRequests.createGuest.path,
            getAddress: checkoutRequests.getAddress.path,
            loginUrl: '/login',
            paymentPageUrlPrefix,
            getGeoLocation: checkoutRequests.getGeoLocation.path,
            getCustomer: checkoutRequests.getCustomer.path
        };
    },
    props: {
        isLoggedIn: {
            default: boolean('Is User Logged In', false)
        },

        serviceType: {
            default: select('Service Type', ['collection', 'delivery', 'dinein', 'invalid-url'], 'delivery')
        },

        locale: {
            default: select('Locale', [locales.gb])
        },

        isAsapAvailable: {
            default: boolean('Is ASAP available', true)
        },

        patchCheckoutError: {
            default: select('Patch Checkout Errors', patchCheckoutErrorOptions)
        },

        getCheckoutError: {
            default: select('Get Checkout Errors', getCheckoutErrorOptions, null)
        },

        placeOrderError: {
            default: select('Place Order Errors', placeOrderErrorOptions)
        },

        fulfilmentTimeSelection: {
            default: select('Fulfilment Time Options', fulfilmentTimeOptions)
        }
    },

    computed: {
        getCheckoutUrl () {
            if (this.fulfilmentTimeSelection) {
                return `/checkout-${this.serviceType}-${this.fulfilmentTimeSelection}.json`;
            }

            return this.getCheckoutError && this.getCheckoutError !== noTimeAvailable ?
                `/checkout-${this.getCheckoutError}-get-error.json` : `/checkout-${this.serviceType}.json`;
        },

        getBasketUrl () {
            return this.getCheckoutError && this.getCheckoutError !== noTimeAvailable ?
                `/checkout-${this.getCheckoutError}-get-error.json` : `/get-basket-${this.serviceType}.json`;
        },

        authToken () {
            return this.isLoggedIn ? mockAuthToken : '';
        },

        updateCheckoutUrl () {
            if (this.patchCheckoutError) {
                return `/update-checkout-${this.patchCheckoutError}.json`;
            }

            return checkoutRequests.updateCheckout.path;
        },

        placeOrderUrl () {
            return this.placeOrderError ? `/place-order-${this.placeOrderError}.json` : checkoutRequests.placeOrder.path;
        },

        checkoutAvailableFulfilmentUrl () {
            if (this.getCheckoutError === noTimeAvailable) {
                return checkoutRequests.checkoutAvailableFulfilmentNoTimeAvailable.path;
            }
            return this.isAsapAvailable ? checkoutRequests.checkoutAvailableFulfilment.path : checkoutRequests.checkoutAvailableFulfilmentPreorder.path;
        }
    },

    methods: {
        otacToAuthExchanger () {
            return mockAuthToken;
        }
    },

    store: new Vuex.Store({
        modules: {
            fCheckoutModule,
            fCheckoutAnalyticsModule,
            fCheckoutExperimentationModule
        }
    }),

    async beforeCreate() {
        await initialise();
    },

    template: function () {
        console.dir(checkoutRequests);
        return '<vue-checkout ' +
        ':getCheckoutUrl="getCheckoutUrl" ' +
        ':updateCheckoutUrl="updateCheckoutUrl" ' +
        ':checkout-available-fulfilment-url="checkoutAvailableFulfilmentUrl" ' +
        ':create-guest-url="checkoutRequests.createGuest.path" ' +
        ':get-basket-url="getBasketUrl" ' +
        ':authToken="authToken" ' +
        ':otacToAuthExchanger="otacToAuthExchanger"' +
        ':locale="locale" ' +
        ':loginUrl="loginUrl" ' +
        ':getAddressUrl="checkoutRequests.getAddress.path" ' +
        ':placeOrderUrl="placeOrderUrl" ' +
        ':paymentPageUrlPrefix="paymentPageUrlPrefix" ' +
        'applicationName="Storybook" ' +
        ':getGeoLocationUrl="checkoutRequests.getGeoLocation.path" ' +
        ':getCustomerUrl="checkoutRequests.getCustomer.path" ' +
        '/>'
    }()
});

CheckoutComponent.storyName = 'f-checkout';

export default {
    title: 'Components/Organisms',
    decorators: [withA11y],
    parameters: {
        layout: 'fullscreen'
    }
};

import httpModule from '@justeat/f-http';
import {
    mount, createLocalVue
} from '@vue/test-utils';
import Vuex from 'vuex';
import flushPromises from 'flush-promises';
import { VueI18n } from '@justeat/f-globalisation';
import {
    defaultCheckoutState, i18n, createStore, defaultCheckoutActions, $logger
} from './helpers/setup';
import {
    ANALYTICS_ERROR_CODE_INVALID_MODEL_STATE,
    CHECKOUT_METHOD_DELIVERY,
    CHECKOUT_METHOD_COLLECTION,
    ERROR_CODE_FULFILMENT_TIME_INVALID,
    TENANT_MAP
} from '../../constants';

import Checkout from '../Checkout.vue';
import EventNames from '../../event-names';

const {
    mockFactory,
    httpVerbs
} = httpModule;

const localVue = createLocalVue();

localVue.use(VueI18n);
localVue.use(Vuex);

const updateCheckoutUrl = 'http://localhost/updatecheckout';
const getCheckoutUrl = 'http://localhost/checkout';
const checkoutAvailableFulfilmentUrl = 'http://localhost/checkout/fulfilment';
const loginUrl = 'http://localhost/login';
const createGuestUrl = 'http://localhost/createguestuser';
const getBasketUrl = 'http://localhost/getbasket';
const getAddressUrl = 'http://localhost/getaddress';
const placeOrderUrl = 'http://localhost/placeorder';
const paymentPageUrlPrefix = 'http://localhost/paymentpage';
const getGeoLocationUrl = 'http://localhost/geolocation';
const otacToAuthExchanger = () => '';
const applicationName = 'Jest';
const spinnerTimeout = 100;


const propsData = {
    updateCheckoutUrl,
    getCheckoutUrl,
    loginUrl,
    checkoutAvailableFulfilmentUrl,
    createGuestUrl,
    getBasketUrl,
    getAddressUrl,
    placeOrderUrl,
    paymentPageUrlPrefix,
    getGeoLocationUrl,
    applicationName,
    spinnerTimeout,
    otacToAuthExchanger
};

const alertCode = 'Something went wrong, please try again later';

// const message = {
//     code: ERROR_CODE_FULFILMENT_TIME_INVALID,
//     shouldRedirectToMenu: true,
//     shouldShowInDialog: true
// };

// const setGuestFormFieldValues = wrapper => {
//     wrapper.find('[data-test-id="formfield-guest-first-name-input"]').setValue(defaultCheckoutState.customer.firstName);
//     wrapper.find('[data-test-id="formfield-guest-last-name-input"]').setValue(defaultCheckoutState.customer.lastName);
//     wrapper.find('[data-test-id="formfield-guest-email-input"]').setValue(defaultCheckoutState.customer.emailAddress);
//     wrapper.find('[data-test-id="formfield-mobile-number-input"]').setValue(defaultCheckoutState.customer.mobileNumber);
//     wrapper.find('[data-test-id="formfield-address-line-1-input"]').setValue(defaultCheckoutState.address.line1);
//     wrapper.find('[data-test-id="formfield-address-line-2-input"]').setValue(defaultCheckoutState.address.line2);
//     wrapper.find('[data-test-id="formfield-address-locality-input"]').setValue(defaultCheckoutState.address.locality);
//     wrapper.find('[data-test-id="formfield-address-postcode-input"]').setValue(defaultCheckoutState.address.postcode);
// };

// const setFormFieldValues = wrapper => {
//     wrapper.find('[data-test-id="formfield-mobile-number-input"]').setValue(defaultCheckoutState.customer.mobileNumber);
//     wrapper.find('[data-test-id="formfield-address-line-1-input"]').setValue(defaultCheckoutState.address.line1);
//     wrapper.find('[data-test-id="formfield-address-line-2-input"]').setValue(defaultCheckoutState.address.line2);
//     wrapper.find('[data-test-id="formfield-address-locality-input"]').setValue(defaultCheckoutState.address.locality);
//     wrapper.find('[data-test-id="formfield-address-postcode-input"]').setValue(defaultCheckoutState.address.postcode);
// };


describe('Checkout API service', () => {
    it('should be defined', () => {
        // Arrange
        const div = document.createElement('div');
        document.body.appendChild(div);
        const wrapper = mount(Checkout, {
            propsData,
            i18n,
            store: createStore(),
            localVue,
            attachTo: div
        });

        // Assert
        expect(wrapper.exists()).toBe(true);
    });

    it('should respond with 201 when request to checkout is made with user logged in', async () => {
        // Arrange & Act
        const div = document.createElement('div');
        document.body.appendChild(div);
        const wrapper = mount(Checkout, {
            store: createStore({ ...defaultCheckoutState, isLoggedIn: true }),
            i18n,
            localVue,
            propsData,
            attachTo: div
        });

        mockFactory.setupMockResponse(httpVerbs.GET, propsData.getCheckoutUrl, 201);
        await flushPromises();

        // Assert
        expect(wrapper.emitted(EventNames.CheckoutGetSuccess).length).toBe(1);
    });

    // it('should respond with 400 when request to checkout is made with user logged in', async () => {
    //     // Arrange & Act
    //     const div = document.createElement('div');
    //     document.body.appendChild(div);
    //     const wrapper = mount(Checkout, {
    //         store: createStore(defaultCheckoutState, { ...defaultCheckoutActions, getCheckout: jest.fn(async () => Promise.reject()) }),
    //         i18n,
    //         localVue,
    //         propsData,
    //         mocks: {
    //             $logger
    //         },
    //         attachTo: div
    //     });
    //     await flushPromises();

    //     // Assert
    //     expect(wrapper.emitted(EventNames.CheckoutGetFailure).length).toBe(1);
    // });

    it('responds with 201 when request to get basket is made', async () => {
        // Arrange
        const div = document.createElement('div');
        document.body.appendChild(div);
        const wrapper = mount(Checkout, {
            store: createStore(),
            i18n,
            localVue,
            propsData,
            attachTo: div
        });
        mockFactory.setupMockResponse(httpVerbs.GET, propsData.getBasketUrl, defaultCheckoutState, 201);

        // Act
        await flushPromises();

        // Assert
        expect(wrapper.emitted(EventNames.CheckoutBasketGetSuccess).length).toBe(1);
        expect(wrapper.emitted(EventNames.CheckoutBasketGetFailure)).toBeUndefined();
    });

    // it('responds with a failure when request to get basket has failed', async () => {
    //     // Arrange
    //     // const error = new Error('Doh exception man!');
    //     const div = document.createElement('div');
    //     document.body.appendChild(div);
    //     const wrapper = mount(Checkout, {
    //         store: createStore({ ...defaultCheckoutState, isLoggedIn: true }),
    //         i18n,
    //         localVue,
    //         propsData,
    //         mocks: {
    //             $logger
    //         },
    //         // data () {
    //         //     return {
    //         //         hasCheckoutLoadedSuccessfully: false
    //         //     };
    //         // }
    //     });

    //     mockFactory.setupMockResponse(httpVerbs.GET, propsData.getCheckoutUrl, 201);

    //     // Act
    //     await wrapper.vm.loadBasket();
    //     await flushPromises();

    //     // Assert
    //     expect(wrapper.emitted(EventNames.CheckoutBasketGetFailure).length).toBe(1);
    // });


    it('should return `true` for delivery order without address when user is logged in', async () => {
        // Arrange
        const div = document.createElement('div');
        document.body.appendChild(div);
        const wrapper = mount(Checkout, {
            store: createStore({ ...defaultCheckoutState, isLoggedIn: true }),
            i18n,
            localVue,
            propsData,
            attachTo: div
        });

        mockFactory.setupMockResponse(httpVerbs.GET, propsData.getCheckoutUrl, 201);

        // Act
        await wrapper.vm.loadAddress();
        await flushPromises();

        // Assert
        expect(wrapper.emitted(EventNames.CheckoutAddressGetSuccess).length).toBe(1);
    });

    it('should return `true` for delivery order without address when user is logged in', async () => {
        // Arrange
        const error = new Error('Doh exception man!');
        const div = document.createElement('div');
        document.body.appendChild(div);
        const store = createStore(defaultCheckoutState, { ...defaultCheckoutActions, getAddress: jest.fn(async () => Promise.reject(error)) });
        const wrapper = mount(Checkout, {
            store,
            i18n,
            localVue,
            propsData,
            mocks: {
                $logger
            },
            attachTo: div
        });

        mockFactory.setupMockResponse(httpVerbs.GET, propsData.getCheckoutUrl, 201);

        // Act
        await wrapper.vm.loadAddress();
        await flushPromises();

        // Assert
        expect(wrapper.emitted(EventNames.CheckoutAddressGetFailure).length).toBe(1);
    });
});

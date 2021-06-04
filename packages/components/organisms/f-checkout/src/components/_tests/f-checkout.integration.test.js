// import httpModule from '@justeat/f-http';
import {
    mount, createLocalVue
} from '@vue/test-utils';
import Vuex from 'vuex';
import flushPromises from 'flush-promises';
import { VueI18n } from '@justeat/f-globalisation';
import {
    defaultCheckoutState, i18n, createStore, defaultCheckoutActions, $logger
} from './helpers/setup';
// import { config } from '../../../test/constants/comsumer';

import Checkout from '../Checkout.vue';
import EventNames from '../../event-names';

// const {
//     mockFactory,
//     httpVerbs
// } = httpModule;

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

// const alertCode = 'Something went wrong, please try again later';

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

const setFormFieldValues = wrapper => {
    wrapper.find('[data-test-id="formfield-mobile-number-input"]').setValue(defaultCheckoutState.customer.mobileNumber);
    wrapper.find('[data-test-id="formfield-address-line-1-input"]').setValue(defaultCheckoutState.address.line1);
    wrapper.find('[data-test-id="formfield-address-line-2-input"]').setValue(defaultCheckoutState.address.line2);
    wrapper.find('[data-test-id="formfield-address-locality-input"]').setValue(defaultCheckoutState.address.locality);
    wrapper.find('[data-test-id="formfield-address-postcode-input"]').setValue(defaultCheckoutState.address.postcode);
};


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

        setFormFieldValues(wrapper);

        // Act
        // mockFactory.setupMockResponse(httpVerbs.GET, propsData.getCheckoutUrl, defaultCheckoutState, 201, EventNames.CheckoutGetSuccess);
        await flushPromises();

        // Assert
        expect(wrapper.emitted(EventNames.CheckoutGetSuccess).length).toBe(1);
        expect(wrapper.emitted(EventNames.CheckoutAvailableFulfilmentGetSuccess).length).toBe(1);
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

    it('should respond with 201 when a successful order request to payments is made', async () => {
        // Arrange
        const basketId = 'myBasketId-v1';
        const div = document.createElement('div');
        document.body.appendChild(div);
        const wrapper = mount(Checkout, {
            store: createStore({
                ...defaultCheckoutState,
                basket: {
                    id: basketId
                }
            }),
            i18n,
            localVue,
            propsData,
            attachTo: div,
            mocks: {
                $logger
            }
        });

        // Act
        // mockFactory.setupMockResponse(httpVerbs.POST, propsData.paymentPageUrlPrefix, defaultCheckoutState, 201);
        await wrapper.vm.submitOrder();
        await flushPromises();

        // Assert
        expect(wrapper.emitted(EventNames.CheckoutSuccess).length).toBe(1);
        expect(wrapper.emitted(EventNames.CheckoutPlaceOrderSuccess).length).toBe(1);
    });

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

        // Act
        // mockFactory.setupMockResponse(httpVerbs.GET, propsData.getBasketUrl, defaultCheckoutState, 201);
        await flushPromises();

        // Assert
        expect(wrapper.emitted(EventNames.CheckoutBasketGetSuccess).length).toBe(1);
        expect(wrapper.emitted(EventNames.CheckoutBasketGetFailure)).toBeUndefined();
    });

    it('responds with a failure when request to get basket has failed', async () => {
        // Arrange
        // const error = new Error('Doh exception man!');
        const div = document.createElement('div');
        document.body.appendChild(div);
        const wrapper = mount(Checkout, {
            store: createStore(defaultCheckoutState, { ...defaultCheckoutActions, getBasket: jest.fn(async () => Promise.reject()) }),
            i18n,
            localVue,
            propsData,
            mocks: {
                $logger
            }
        });

        // Act
        // mockFactory.setupMockResponse(httpVerbs.GET, propsData.getBasketUrl, 201);
        // await wrapper.vm.loadBasket();
        await flushPromises();

        // Assert
        // console.log('YOOOOOOO', wrapper.emitted());
        expect(wrapper.emitted(EventNames.CheckoutBasketGetFailure).length).toBe(1);
    });


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

        // Act
        // mockFactory.setupMockResponse(httpVerbs.GET, propsData.getCheckoutUrl, 201);
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

        // Act
        // mockFactory.setupMockResponse(httpVerbs.GET, propsData.getCheckoutUrl, 201);
        await wrapper.vm.loadAddress();
        await flushPromises();

        // Assert
        expect(wrapper.emitted(EventNames.CheckoutAddressGetFailure).length).toBe(1);
    });

    // it('responds with 201 when request is made to login', async () => {
    //     // Arrange & Act
    //     const div = document.createElement('div');
    //     document.body.appendChild(div);
    //     const wrapper = mount(Checkout, {
    //         store: createStore(),
    //         i18n,
    //         localVue,
    //         propsData,
    //         attachTo: div
    //     });

    //     mockFactory.setupMockResponse(httpVerbs.POST, propsData.loginUrl, 201);
    //     // const loginLink = wrapper.find("[data-test-id='switch-user-link']");
    //     // loginLink.simulate('click');
    //     await flushPromises();

    //     // Assert
    //     expect(wrapper.emitted(EventNames.CheckoutVisitLoginPage).length).toBe(1);
    // });
});

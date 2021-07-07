/* eslint indent: ["error", 4, {ignoredNodes: ["TemplateLiteral > *"]}] */
/* eslint-disable no-unused-vars */
import appboySDK from '@braze/web-sdk';

import 'core-js/modules/es.object.from-entries';

import isAppboyInitialised from '../utils/isAppboyInitialised';
import areCookiesPermitted from '../utils/areCookiesPermitted';
import removeDuplicateContentCards from '../utils/removeDuplicateContentCards';
import BrazeDispatcher from '../BrazeDispatcher';
import dispatcherEventStream from '../DispatcherEventStream';
import {
    CONTENT_CARDS_EVENT_NAME,
    IN_APP_MESSAGE_EVENT_CLICKS_NAME,
    IN_APP_MESSAGE_EVENT_NAME,
    LOGGER
} from '../types/events';

jest.mock('@braze/web-sdk');
jest.mock('../utils/isAppboyInitialised');
jest.mock('../utils/areCookiesPermitted');
jest.mock('../utils/removeDuplicateContentCards');

let appboy;
jest.isolateModules(() => {
    /* eslint-disable-next-line global-require */
    appboy = require('@braze/web-sdk');
    jest.mock('@braze/web-sdk');
});

const dataLayer = {
    push: jest.fn()
};

const apiKey = '__API_KEY__';
const userId = '__USER_ID__';

const LOG_ERROR = 'error';

const enabledComponentParameters = {
    disableComponent: false,
    apiKey,
    userId
};

const inAppMessageButtons = [
    {
        subscribeToClickedEvent: jest.fn()
    },
    {
        subscribeToClickedEvent: jest.fn()
    }
];

const contentCardsMockCallback = jest.fn();
const inAppMessagesMockCallback = jest.fn();
const inAppMessageClicksMockCallback = jest.fn();
const loggerCallback = jest.fn();

dispatcherEventStream.subscribe(CONTENT_CARDS_EVENT_NAME, contentCardsMockCallback);
dispatcherEventStream.subscribe(IN_APP_MESSAGE_EVENT_NAME, inAppMessagesMockCallback);
dispatcherEventStream.subscribe(IN_APP_MESSAGE_EVENT_CLICKS_NAME, inAppMessageClicksMockCallback);
dispatcherEventStream.subscribe(LOGGER, loggerCallback);

beforeEach(() => {
    jest.resetAllMocks();
    window.dataLayer = dataLayer;
    window.appboy = appboy;
});

describe('instantiation', () => {
    describe('BrazeDispatcher', () => {
        const sessionTimeoutInSeconds = 0;

        it('should have a property `eventSignifier` with default value `BrazeContent`', () => {
            // Arrange & Act
            const options = {
                sessionTimeoutInSeconds,
                ...enabledComponentParameters
            };
            const dispatcher = new BrazeDispatcher(options);

            // Assert
            expect(dispatcher.eventSignifier).toBe('BrazeContent');
        });

        describe('initialisation', () => {
            it.each`
                parameter             | value
                ${'apiKey'}           | ${null}
                ${'userId'}           | ${null}
            `('should not attempt to subscribe if $parameter is $value', async ({ parameter, value }) => {
                // Arrange
                const options = {
                    ...enabledComponentParameters,
                    ...{
                        [parameter]: value
                    }
                };

                // Act
                function mockFunction () {
                    const dispatcher = new BrazeDispatcher(options);
                }

                // Act
                expect(mockFunction).toThrowError(new Error('Not initialising braze due to config'));

                // Assert
                expect(appboy.subscribeToInAppMessage).not.toHaveBeenCalled();
                expect(appboy.subscribeToContentCardsUpdates).not.toHaveBeenCalled();
                expect(appboy.requestContentCardsRefresh).not.toHaveBeenCalled();
            });

            it.each`
                appboyInstanceOrigin  | value
                ${'sdk'}              | ${false}
                ${'window'}           | ${true}
            `('should subscribe to correct appboy instance if isAppboyInitialised returns $value', async ({
                appboyInstanceOrigin,
                value
            }) => {
                // Arrange
                const appboyInstance = (appboyInstanceOrigin === 'sdk' ? appboySDK : appboy);
                isAppboyInitialised.mockReturnValue(value);

                // Act
                const dispatcher = new BrazeDispatcher(enabledComponentParameters);

                // Assert
                expect(appboyInstance.subscribeToInAppMessage).toHaveBeenCalled();
                expect(appboyInstance.subscribeToContentCardsUpdates).toHaveBeenCalled();
                expect(appboyInstance.requestContentCardsRefresh).toHaveBeenCalled();
            });

            describe('on initialisation of bundled sdk version of braze library', () => {
                beforeEach(() => {
                    // Arrange
                    isAppboyInitialised.mockReturnValue(false);
                });

                it.each([
                    [true, true, false, true],
                    [true, true, true, false],
                    [false, false, false, true],
                    [false, false, true, false],
                    [undefined, undefined, true, false]
                ])('should initialise appboy with the correct logging (`%p` ➡ `%p`) and cookie (`%p` ➡ `$p`) parameters', (
                    enableLoggingConfig,
                    expectedEnableLoggingParameter,
                    areCookiesPermittedValue,
                    expectedNoCookiesParamater
                ) => {
                    // Arrange
                    areCookiesPermitted.mockReturnValue(areCookiesPermittedValue);

                    // Act
                    const dispatcher = new BrazeDispatcher({
                        ...enabledComponentParameters,
                        enableLogging: enableLoggingConfig
                    });

                    // Assert
                    expect(appboySDK.initialize).toHaveBeenCalledWith(apiKey, {
                        enableLogging: expectedEnableLoggingParameter,
                        sessionTimeoutInSeconds: 0,
                        noCookies: expectedNoCookiesParamater
                    });
                });

                it('should open a session following initialisation', () => {
                    // Act
                    // eslint-disable-next-line no-unused-vars
                    const dispatcher = new BrazeDispatcher(enabledComponentParameters);

                    // Assert
                    expect(appboySDK.openSession).toHaveBeenCalledAfter(appboySDK.initialize);
                });

                it('should subscribe to callbacks following opening a session', () => {
                    // Arrange & Act
                    const dispatcher = new BrazeDispatcher(enabledComponentParameters);

                    // Assert
                    expect(appboySDK.subscribeToInAppMessage).toHaveBeenCalledAfter(appboySDK.openSession);
                });

                it('should set the userId following callback subscription', () => {
                    // Arrange & Act
                    const dispatcher = new BrazeDispatcher(enabledComponentParameters);

                    // Assert
                    expect(appboySDK.changeUser).toHaveBeenCalledAfter(appboySDK.requestContentCardsRefresh);
                });

                it('should pass through the userId along with a callback', () => {
                    // Arrange & Act
                    const dispatcher = new BrazeDispatcher(enabledComponentParameters);

                    // Assert
                    expect(appboySDK.changeUser).toHaveBeenCalledWith(userId, expect.any(Function));
                });
            });

            // it.each([
            //     [true],
            //     [false]
            // ])('should reject being called a second time with different parameters', appboyInitialised => {
            //     // Arrange
            //     expect.assertions(1);
            //     isAppboyInitialised.mockReturnValue(appboyInitialised);
            //     const dispatcher = new BrazeDispatcher(enabledComponentParameters);
            //
            //     // Act
            //     try {
            //         await brazeDispatcher.configure({
            //             ...enabledComponentParameters,
            //             userId: '__INVALID_USER_ID__'
            //         });
            //     } catch (error) {
            //         // Assert
            //         expect(error.message).toBe('Attempt to reinitialise appboy with different parameters');
            //     }
            // });

            // it.each([
            //     [true],
            //     [false]
            // ])('should return the same promise if called a second time with similar parameters', async appboyInitialised => {
            //     // Arrange
            //     isAppboyInitialised.mockReturnValue(appboyInitialised);
            //     const promiseA = await brazeDispatcher.configure(enabledComponentParameters);
            //
            //     // Act
            //     const promiseB = await brazeDispatcher.configure(enabledComponentParameters);
            //
            //     // Assert
            //     expect(promiseA).toBe(promiseB);
            // });

            it('should push an event to datalayer when userId set following initialisation', () => {
                // Arrange
                appboySDK.changeUser.mockImplementation((id, callback) => callback());

                // Act
                const dispatcher = new BrazeDispatcher(enabledComponentParameters);

                // Assert
                expect(dataLayer.push).toHaveBeenCalledWith({
                    event: 'appboyReady'
                });
            });

            // it('should not request a refresh if an update is already pending', async () => {
            //     // Arrange
            //     await brazeDispatcher.configure(enabledComponentParameters);
            //     appboy.requestContentCardsRefresh.mockReset();
            //
            //     // Act
            //     await brazeDispatcher.configure(enabledComponentParameters);
            //
            //     // Assert
            //     expect(appboy.requestContentCardsRefresh).not.toHaveBeenCalled();
            // });
        });
    });
});

describe('BrazeDispatcher operation', () => {
    const callbackConfiguredComponentParameters = {
        ...enabledComponentParameters
    };

    let dispatcher,
        interceptInAppMessagesHandler,
        contentCardsHandler;

    beforeEach(() => {
        appboy.subscribeToInAppMessage.mockImplementation(callback => {
            interceptInAppMessagesHandler = callback;
        });
        appboy.subscribeToContentCardsUpdates.mockImplementation(callback => {
            contentCardsHandler = callback;
        });

        dispatcher = new BrazeDispatcher(callbackConfiguredComponentParameters);
    });

    describe('callbacks', () => {
        describe('contentCardsHandler', () => {
            const rawCards = [
                { id: 'card1' },
                { id: 'card2' }
            ];

            beforeEach(() => {
                removeDuplicateContentCards.mockReturnValue(rawCards);
            });

            it('should call registered callback with returned cards', () => {
                // Arrange & Act
                contentCardsHandler({ rawCards });

                // Assert
                expect(contentCardsMockCallback).toHaveBeenCalledWith(rawCards);
            });
        });

        describe('interceptInAppMessagesHandler', () => {
            let message;

            beforeEach(() => {
                message = new appboy.InAppMessage();
                message.buttons = inAppMessageButtons;
            });

            describe('when braze is initialised', () => {});

            it('should call registered callback', async () => {
                // Act
                await interceptInAppMessagesHandler(message);

                // Assert
                expect(inAppMessagesMockCallback).toHaveBeenCalledWith(message);
            });

            it('should call braze display function for message', async () => {
                // Act
                await interceptInAppMessagesHandler(message);

                // Assert
                expect(appboy.display.showInAppMessage).toHaveBeenCalledWith(message);
            });

            it('should subscribe internal callback to the CTA button click event', async () => {
                // Act
                await interceptInAppMessagesHandler(message);

                // Assert
                expect(message.buttons[1].subscribeToClickedEvent).toHaveBeenCalledWith(expect.any(Function));
            });
        });

        describe('interceptInAppMessageClickEventsHandler', () => {
            let message,
                messageClickEventsHandler;

            beforeEach(() => {
                message = new appboy.InAppMessage();
                message.buttons = inAppMessageButtons;
                message.buttons[1].subscribeToClickedEvent.mockImplementation(clickEventsHandler => {
                    messageClickEventsHandler = clickEventsHandler;
                });
            });

            it('should subscribe internal callback to the CTA button click event', async () => {
                // Arrange
                await interceptInAppMessagesHandler(message);
                expect(message.buttons[1].subscribeToClickedEvent).toHaveBeenCalledWith(expect.any(Function));

                // Act
                messageClickEventsHandler();

                // Assert
                expect(inAppMessageClicksMockCallback).toHaveBeenCalledWith(message);
            });
        });
    });

    describe('card logging', () => {
        const rawCards = [
            { id: 'card1' },
            { id: 'card2' }
        ];

        beforeEach(() => {
            removeDuplicateContentCards.mockReturnValue(rawCards);
            contentCardsHandler({ rawCards });
        });

        describe('logCardClick', () => {
            it('should report back to braze a card resolved from its given ID', () => {
                // Act
                dispatcher.logCardClick(rawCards[0].id);

                // Assert
                expect(appboy.logCardClick).toHaveBeenCalledWith(rawCards[0], true);
            });

            it('should request a flush of data', () => {
                // Act
                dispatcher.logCardClick(rawCards[0].id);

                // Assert
                expect(appboy.requestImmediateDataFlush).toHaveBeenCalledAfter(appboy.logCardClick);
            });
        });

        describe('logCardImpressions', () => {
            it('should report back to braze a list of cards resolved from their given IDs', () => {
                // Act
                dispatcher.logCardImpressions([rawCards[0].id, rawCards[1].id]);

                // Assert
                expect(appboy.logCardImpressions).toHaveBeenCalledWith([rawCards[0], rawCards[1]], true);
            });

            it('should request a flush of data', () => {
                // Act
                dispatcher.logCardImpressions([rawCards[0].id, rawCards[1].id]);

                // Assert
                expect(appboy.requestImmediateDataFlush).toHaveBeenCalledAfter(appboy.logCardImpressions);
            });
        });

        describe('pushShapedEventToDataLayer', () => {
            it('should report back to braze a list of cards resolved from their given IDs', async () => {
                // Arrange
                const pushToDataLayer = jest.fn();
                const givenContent = { foo: 'bar' };

                // Act
                dispatcher.pushShapedEventToDataLayer(pushToDataLayer, givenContent);

                // Assert
                expect(pushToDataLayer).toHaveBeenCalledWith({
                    event: dispatcher.eventSignifier,
                    custom: {
                        braze: givenContent
                    }
                });
            });
        });
    });
});

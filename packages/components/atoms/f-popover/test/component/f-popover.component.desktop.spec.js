const { buildUrl } = require('@justeat/f-wdio-utils/src/storybook-extensions');
const Popover = require('../../test-utils/component-objects/f-popover.component');

const popover = new Popover();

describe('f-popover component tests', () => {
    beforeEach(() => {
        const pageUrl = buildUrl(popover.componentType, popover.componentName, popover.path);
        popover.open(pageUrl);
        popover.waitForComponent();
    });

    it('should display the f-popover component', () => {
        // Assert
        expect(popover.isComponentDisplayed()).toBe(true);
    });
});

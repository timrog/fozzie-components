const Page = require('@justeat/f-wdio-utils/src/page.object');
const { COMPONENT } = require('./f-toggle-selectors');

module.exports = class Toggle extends Page {
    constructor () {
        super('atom', 'toggle-component');
    }

    get component () {
        return $(COMPONENT);
    }

    waitForComponent () {
        super.waitForComponent(this.component);
    }

    isComponentDisplayed () {
        return this.component.isDisplayed();
    }
};

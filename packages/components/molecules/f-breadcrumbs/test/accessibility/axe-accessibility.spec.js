const { buildUrl } = require('@justeat/f-wdio-utils/src/storybook-extensions');
const { getAccessibilityTestResults } = require('../../../../../../test/utils/axe-helper');
const Breadcrumbs = require('../../test-utils/component-objects/f-breadcrumbs.component');

const breadcrumbs = new Breadcrumbs();

describe('Accessibility tests', () => {
    beforeEach(() => {
        const pageUrl = buildUrl(breadcrumbs.componentType, breadcrumbs.componentName, breadcrumbs.path);
        breadcrumbs.open(pageUrl);
        breadcrumbs.waitForComponent();
    });
    it('a11y - should test f-breadcrumbs component WCAG compliance', () => {
        // Act
        const axeResults = getAccessibilityTestResults('f-breadcrumbs');

        // Assert
        expect(axeResults.violations.length).toBe(0);
    });
});

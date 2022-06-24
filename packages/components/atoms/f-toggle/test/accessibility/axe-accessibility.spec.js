import { getAxeResults } from '../../../../../../test/utils/axe-helper'; // eslint-disable-line import/no-relative-packages

const Toggle = require('../../test-utils/component-objects/f-toggle.component');

const toggle = new Toggle();

describe('Accessibility tests', () => {
    beforeEach(() => {
        toggle.load();
    });

    it('a11y - should test f-toggle component WCAG compliance', () => {
        // Act
        const axeResults = getAxeResults('f-toggle');

        // Assert
        expect(axeResults.violations.length).toBe(0);
    });
});

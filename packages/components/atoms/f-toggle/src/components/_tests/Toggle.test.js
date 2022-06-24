import { mount } from '@vue/test-utils';
import Toggle from '../Toggle.vue';

describe('Toggle', () => {
    it('should be able to toggle on', async () => {
        const wrapper = mount(Toggle, {
            propsData: { value: false }
        });

        const toggle = wrapper.find('div[data-testid="toggle"] input[type="checkbox"]');

        expect(toggle.element.checked).toBeFalsy();
        await toggle.trigger('click');
        expect(toggle.element.checked).toBeTruthy();
    });

    it('should be able to init the component toggled on', async () => {
        const wrapper = mount(Toggle, {
            propsData: { value: true }
        });

        const toggle = wrapper.find('div[data-testid="toggle"] input[type="checkbox"]');

        expect(toggle.element.checked).toBeTruthy();
    });

    it('should not be able to be toggled on when the component is disabled', async () => {
        const wrapper = mount(Toggle, {
            propsData: { value: false, disabled: true }
        });

        const toggle = wrapper.find('div[data-testid="toggle"] input[type="checkbox"]');

        expect(toggle.element.checked).toBeFalsy();
        await toggle.trigger('click');
        expect(toggle.element.checked).toBeFalsy();
    });

    it('should not be able to be toggled off when the component is disabled', async () => {
        const wrapper = mount(Toggle, {
            propsData: { value: true, disabled: true }
        });

        const toggle = wrapper.find('div[data-testid="toggle"] input[type="checkbox"]');

        expect(toggle.element.checked).toBeTruthy();
        await toggle.trigger('click');
        expect(toggle.element.checked).toBeTruthy();
    });
});

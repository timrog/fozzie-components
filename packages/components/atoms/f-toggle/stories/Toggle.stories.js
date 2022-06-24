// Uncomment the import below to add prop controls to your Story (and add `withKnobs` to the decorators array)
// import {
//     withKnobs, select, boolean
// } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { action } from '@storybook/addon-actions';
import Toggle from '../src/components/Toggle.vue';

export default {
    title: 'Components/Atoms',
    decorators: [withA11y]
};

export const ToggleComponent = (args, { argTypes }) => ({
    components: { Toggle },
    props: Object.keys(argTypes),
    template: `<main>
      <Toggle v-bind="$props" @input="toggleChange" />
    </main>`,
    methods: {
        toggleChange: state => {
            action(`This is the toggle state is ${state}`)(args);
        }
    }
});

ToggleComponent.storyName = 'f-toggle';

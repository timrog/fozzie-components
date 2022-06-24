<template>
    <div data-testid="toggle">
        <input
            :id="id"
            class="toggle"
            type="checkbox"
            :value="value"
            :checked="value"
            :disabled="disabled"
            @change="onChange"
        >
        <label
            :for="id"
            class="toggle__outer">
            <div class="toggle__inner">
                <div class="toggle__inner__dot" />
            </div>
        </label>
    </div>
</template>

<script lang="javascript">
import { defineComponent } from 'vue-demi';

export default defineComponent({
    components: {},
    props: {
        value: {
            type: Boolean,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    emits: ['input'],
    setup (props, { emit }) {
        return {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
            onChange: () => emit('input', !props.value)
        };
    }
});
</script>

<style lang="scss" scoped>
@import "@justeat/fozzie-colour-palette/src/scss/index.scss";

*,
::after,
::before {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: currentColor;
}
.toggle {
  position: absolute;
  left: -9999px;
  background: $orange;
  &__outer {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
  }
  &__inner {
    transition: all 0.2s;
    width: 48px;
    height: 24px;
    padding: 2px;
    border-radius: 22px;
    background-color: #edf1fe;
    &:hover {
      background-color: $grey--light;
    }
    &:active {
      background-color: $grey--mid;
    }
    &__dot {
      transition: all 0.3s;
      width: 20px;
      height: 20px;
      border-radius: 9999px;
      background-color: $white;
    }
  }

  &:checked {
    + .toggle__outer .toggle__inner {
      justify-content: flex-end;
      background-color: $blue;
      &__dot {
        transform: translateX(24px);
      }
    }
  }
  &:disabled {
    + .toggle__outer {
      cursor: not-allowed;
      .toggle__inner {
        background-color: $grey--light;
      }
    }
  }
}
</style>

<template>
  <FormElement :label="label" :disabled="disabled === true" :class="{ checked: modelValue }">
    <template #label><slot name="label"></slot></template>
    <slot name="before"></slot>
    <div class="inner">
      <input type="checkbox" :disabled="disabled === true" :checked="modelValue" @input="onInput" />
      <i />
    </div>
    <slot name="after"></slot>
  </FormElement>
</template>

<script setup lang="ts">
import FormElement from './FormElement.vue'
import type { ToggleProps } from '../../types/forms'

const emit = defineEmits<{
  'update:model-value': [value: boolean]
}>()

defineProps<ToggleProps>()

function onInput({ target: { checked } }: any) {
  emit('update:model-value', checked)
}
</script>

<style lang="scss" scoped>
.form-element :deep(*) {
  transition: var(--transition);
}
.inner {
  @include flex-row(start, start);
  @include size(3.5rem, 1.75rem);
  border-radius: 3.5rem;
  position: relative;
  padding: 0;
  box-shadow: inset 0 0 0 1px rgba($gray, 0.5);
}

input {
  @include position(absolute, 0 0 0 0);
  @include size(100%);
  z-index: 20;
  opacity: 0;
}

i {
  @include size(1.75rem);
  border-radius: 100%;
  background: $gray;
}

input:checked + i {
  transform: translateX(100%);
  box-shadow: inset 0 0 0 1px transparent;
  background: $pink;
}

.checked {
}
</style>

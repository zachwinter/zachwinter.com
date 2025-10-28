<template>
  <FormElement :label="label" :disabled="disabled">
    <input
      type="range"
      :value="modelValue"
      :min="min"
      :max="max"
      :step="step"
      @pointerup="$emit('blur')"
      @input="(e: any) => onInput(e)"
      :disabled="disabled"
    />
    <div class="value" ref="val">
      {{ Number(modelValue)?.toFixed?.(3) }}
    </div>
  </FormElement>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FormElement from './FormElement.vue'

import type { RangeInputProps } from '../../types/forms'

const emit = defineEmits<{
  'update:model-value': [value: number]
  blur: []
  focus: []
  input: [e: InputEvent]
}>()

defineProps<RangeInputProps>()

function onInput(e: any) {
  emit('input', e)
  emit('update:model-value', parseFloat(e.target.value))
}

const val = ref()
</script>

<style lang="scss" scoped>
@include range;

.form-element :deep(*) {
  background-color: transparent;
}

input[type='range'] {
  height: 1.75rem;
  padding-top: 0;
  padding-right: 0;
  width: 8rem;
  flex: 1;
  flex-shrink: 0;
}

.value {
  display: flex;
  align-items: end;
  justify-content: end;
  min-width: 4.5rem;
  margin-left: auto;
  text-align: right;
  padding-right: 0.5rem;
}
</style>

<template>
  <BaseNumberInput
    :label="label"
    :model-value="modelValue"
    :disabled="disabled"
    :placeholder="placeholder"
    :autofocus="autofocus"
    :min="min"
    :max="max"
    :step="step"
    @update:model-value="$emit('update:model-value', $event)"
    @keypress="$emit('keypress', $event)"
    @keydown="$emit('keydown', $event)">
    <template #left>
      <slot name="left" />
    </template>
    <template #right>
      <slot name="right" />
    </template>
  </BaseNumberInput>
</template>

<script setup lang="ts">
import BaseNumberInput from "./BaseNumberInput.vue";
import type { NumberInputProps } from "@kaleidosync/types";

defineEmits<{
  "update:model-value": [value: number];
  keypress: [event: KeyboardEvent];
  keydown: [event: KeyboardEvent];
}>();

defineProps<NumberInputProps>();
</script>

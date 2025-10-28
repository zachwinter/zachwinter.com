<template>
  <BaseInput
    type="text"
    :label="label"
    :model-value="String(modelValue)"
    :disabled="disabled"
    :placeholder="placeholder"
    :autofocus="autofocus"
    @update:model-value="$emit('update:model-value', $event)"
    @keypress="$emit('keypress', $event)"
    @keydown="$emit('keydown', $event)"
    @keyup="$emit('keyup', $event)"
    @blur="$emit('blur', $event)"
    @focus="$emit('focus', $event)">
    <template #left>
      <slot name="left" />
    </template>
    <template #right>
      <slot name="right" />
    </template>
  </BaseInput>
</template>

<script setup lang="ts">
import BaseInput from "./BaseInput.vue";
import type { TextInputProps } from "@kaleidosync/types";

defineEmits<{
  "update:model-value": [value: any];
  keypress: [event: KeyboardEvent];
  keydown: [event: KeyboardEvent];
  keyup: [event: KeyboardEvent];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
}>();

defineProps<TextInputProps>();
</script>

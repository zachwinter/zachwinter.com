<template>
  <FormElement :label="label" :disabled="disabled">
    <slot name="left" />
    <input
      ref="input"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :min="min"
      :max="max"
      :step="step"
      @input="onInput"
      @keypress="$emit('keypress', $event)"
      @keydown="$emit('keydown', $event)"
      @keyup="$emit('keyup', $event)"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)" />
    <slot name="right" />
  </FormElement>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import FormElement from "./FormElement.vue";
import type { InputType } from "@kaleidosync/types";

const emit = defineEmits<{
  "update:model-value": [value: string];
  keypress: [event: KeyboardEvent];
  keydown: [event: KeyboardEvent];
  keyup: [event: KeyboardEvent];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
}>();

const props = withDefaults(
  defineProps<{
    type?: InputType;
    label?: string;
    modelValue: string;
    disabled?: boolean;
    placeholder?: string;
    autofocus?: boolean;
    min?: string | number;
    max?: string | number;
    step?: string | number;
  }>(),
  {
    type: "text",
    disabled: false,
    autofocus: false
  }
);

const input = ref<HTMLInputElement>();

function onInput(e: Event) {
  const target = e.target as HTMLInputElement;
  emit("update:model-value", target.value);
}

onMounted(() => {
  if (props.autofocus) {
    input.value?.focus();
  }
});
</script>

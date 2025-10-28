<template>
  <FormElement :label="label" :disabled="disabled">
    <slot name="left" />
    <textarea
      ref="input"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :min="min"
      :max="max"
      :step="step"
      @blur="$emit('blur')"
      @input="onInput"
      @keypress="$emit('keypress', $event)"
      @keydown="$emit('keydown', $event)" />
    <slot name="right" />
  </FormElement>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from "vue";
import FormElement from "./FormElement.vue";
import type { InputType } from "@kaleidosync/types";

const emit = defineEmits<{
  "update:model-value": [value: string | number];
  keypress: [event: KeyboardEvent];
  keydown: [event: KeyboardEvent];
  blur: [event: any];
}>();

const props = withDefaults(
  defineProps<{
    type?: InputType;
    label?: string;
    modelValue: string;
    disabled?: boolean;
    placeholder?: string;
    autofocus?: boolean;
    autoWidth?: boolean;
    min?: string | number;
    max?: string | number;
    step?: string | number;
  }>(),
  {
    type: "text",
    disabled: false,
    autofocus: false,
    autoWidth: false
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

<style lang="scss" scoped>
.form-element,
:deep(textarea) {
  border-radius: 0 !important;
  border: 0 !important;
  background: transparent !important;
}
textarea {
  @include box;
  min-width: 300px;
}
</style>

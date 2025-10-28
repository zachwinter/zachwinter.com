<template>
  <FormElement :disabled="disabled">
    <Row :gap="1">
      <label v-for="option in options">
        <span>{{ option }}</span>
        <div class="radio-container">
          <input @input="onInput" type="radio" :name="name" :value="option" :checked="option === modelValue" />
          <i />
        </div>
      </label>
    </Row>
  </FormElement>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { SelectProps } from "@kaleidosync/types";
import { FormElement, Row } from "@/components";

const emit = defineEmits<{
  "update:model-value": [value: string];
  keypress: [event: KeyboardEvent];
  keydown: [event: KeyboardEvent];
}>();

const props = defineProps<SelectProps>();

function onInput(e: any) {
  emit("update:model-value", e.target.value);
}

const input = ref();

onMounted(() => {
  if (props.autofocus) {
    input?.value?.focus?.();
  }
});
</script>

<style lang="scss" scoped>
label {
  @include flex-row;
}

select {
  cursor: pointer;
  appearance: none;
}

.radio-container {
  @include size(1rem);
  position: relative;

  input {
    @include position(absolute, 0 0 0 0);
    opacity: 0;
  }

  i {
    @include size(1rem);
    border-radius: 100%;
    display: block;
    border: 1px solid $pink;
    transition: var(--hover-transition);
  }

  input:checked + i {
    background: $pink;
  }
}
</style>

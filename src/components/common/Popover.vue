<template>
  <transition name="fade">
    <aside
      v-if="popover.visible && popover.uniformKey"
      @click.stop
      :key="JSON.stringify([popover.uniformKey, popover.visible, popover.inputTextKey])"
      ref="element"
      class="popover"
      :style="{ transform: popover.transform }">
      <RangeInput
        v-if="isNumber"
        :label="popover.uniformKey"
        v-model="sketches.uniforms[popover.uniformKey].value"
        :min="min"
        :max="max"
        :step="step" />

      <Toggle :label="popover.uniformKey" v-else-if="isBool" v-model="sketches.uniforms[popover.uniformKey].value" />

      <TextInput
        v-else-if="popover.inputTextKey"
        @keypress="onKeyPress"
        v-model="popover.inputText"
        :autofocus="true"
        :placeholder="popover.inputTextKey">
        <template #right>
          <IconButton icon="save" @click="popover.acceptText()" :small="true" />
        </template>
      </TextInput>
    </aside>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { onClickOutside } from "@vueuse/core";
import { usePopover, useToast } from "@/stores";
import TextInput from "../forms/TextInput.vue";
import IconButton from "./IconButton.vue";
import RangeInput from "../forms/RangeInput.vue";
import { useSketches } from "@/stores";
import { uniformRangeUtils } from "@/util";
import Toggle from "../forms/Toggle.vue";

const toast = useToast();
const sketches = useSketches();
const popover = usePopover();
const element = ref();
const min = ref<number | null>(null);
const max = ref<number | null>(null);
const step = ref<number | null>(null);
const isNumber = computed(
  () =>
    typeof min.value === "number" &&
    typeof max.value === "number" &&
    typeof step.value === "number" &&
    popover.uniformKey &&
    typeof sketches.uniforms[popover.uniformKey].value === "number"
);

const isBool = computed(() => popover.uniformKey && typeof sketches.uniforms[popover.uniformKey].value === "boolean");

watch(
  () => popover.uniformKey,
  key => {
    if (!key) return;
    if (!sketches.uniforms?.[key]) return;
    if (typeof sketches.uniforms[key].value !== "number") return;
    const value = (sketches.uniforms as any)[key].value;
    min.value = uniformRangeUtils.getMin(popover.uniformKey, value);
    max.value = uniformRangeUtils.getMax(popover.uniformKey, value);
    step.value = uniformRangeUtils.getStep(popover.uniformKey, value);
  },
  {
    immediate: true
  }
);

function onKeyPress(e: KeyboardEvent) {
  if (e.key === "Enter") {
    popover.acceptText();
  }
}

onClickOutside(element, () => {
  popover.visible = false;
});
</script>

<style lang="scss" scoped>
.popover {
  @include position(fixed, 0 null null 0, 100);
  border-radius: 1rem;
  transform-origin: center center;
  background: var(--black);
  border: 1px solid var(--border);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(16px);
  padding: 1rem;

  // Dark mode styles
  color: var(--white);
  font-family: "Space Mono", monospace;

  // Ensure child components also respect dark mode and use monospace font
  :deep(.text-input),
  :deep(.range-input),
  :deep(.toggle) {
    background: var(--black);
    color: var(--white);
    border-color: var(--border);
    font-family: "Space Mono", monospace;
  }

  :deep(input) {
    background: var(--black);
    color: var(--white);
    border-color: var(--border);
    font-family: "Space Mono", monospace;
  }

  :deep(label) {
    color: var(--white);
    font-family: "Space Mono", monospace;
  }
}

.text {
  background: var(--black);
}
</style>

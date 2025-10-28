<template>
  <aside ref="container" @animationend="onAnimationEnd" :class="{ 'no-animate': noAnimate }"></aside>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue";
import { useShaderEditor } from "./useShaderEditor";

// For backwards compatibility, keep the original props
const props = defineProps<{
  modelValue: string;
  uniformKeys: string[];
  error: any;
}>();

const emit = defineEmits(["update:modelValue", "node-click"]);
const container = ref();
const refs = toRefs(props);
const noAnimate = ref(false);

// Use the backwards-compatible useShaderEditor
useShaderEditor(
  container,
  refs,
  (e: any) => emit("update:modelValue", e),
  (e: any) => emit("node-click", e)
);

const timeout = ref();

function onAnimationEnd() {
  clearTimeout(timeout.value);
  timeout.value = setTimeout(() => {
    noAnimate.value = true;
  }, 150);
}
</script>

<style lang="scss" scoped>
aside {
  @include position(fixed, 0 null null 0, 10);
  height: 100vh;
  display: flex;
  align-items: center;
  pointer-events: none;
}

aside :deep(.cm-editor) {
  pointer-events: auto;
  max-height: 100vh;
  overflow: hidden;
}
</style>

<style lang="scss">
.cm-highlightSpace:first-of-type,
.cm-highlightSpace:first-of-type ~ .cm-highlightSpace {
  position: relative !important;
  background: none !important;
  display: inline-block;
  padding-right: 0.1rem;

  &:before {
    @include size(100%, 1px);
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    background: var(--light-gray-50);
    border-radius: 3px;
    content: "";
    display: block;
  }
}

*:not(span.cm-highlightSpace) ~ span.cm-highlightSpace {
  background: none !important;

  &:before {
    display: none !important;
  }
}

.cm-comment-line .cm-highlightSpace {
  opacity: 0.2 !important;
}

.cm-editor .cm-content .cm-empty-line {
  background: transparent !important;
}

.cm-editor,
.cm-editor * {
  outline: none !important;
}

.cm-line:not(.cm-comment-line) {
  border-bottom: 1px solid var(--white-10) !important;
  background: rgba($black, 0.9) !important;
}

.cm-uniform:hover * {
  cursor: pointer;
}

.cm-content {
  width: auto;
  max-width: 100vw;
}

.cm-line {
  transform-origin: top left;
  line-height: 1rem;
}

.cm-scroller {
  @include hide-scroll-bar;
}

.cm-gutters {
  @include mobile {
    display: none !important;
  }
}

html body .cm-content {
  caret-color: $pink !important;
}
</style>

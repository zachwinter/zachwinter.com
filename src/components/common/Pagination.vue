<template>
  <Row class="pagination">
    <IconButton icon="chevron-left" @click="emit('previous')" />
    <ul>
      <li v-for="i in pages" class="dot" :key="i" @click="emit('select', i - 1)" :class="{ active: active === i }"></li>
    </ul>
    <IconButton icon="chevron-right" @click="emit('next')" />
  </Row>
</template>

<script setup lang="ts">
import Row from "../layout/Row.vue";
import IconButton from "./IconButton.vue";

defineProps<{
  pages: number;
  active: number;
}>();

const emit = defineEmits<{
  (e: "select", i: number): void;
  (e: "previous"): void;
  (e: "next"): void;
}>();
</script>

<style scoped lang="scss">
ul {
  @include flex-row;
  @include box(1 0, 0.5);
  // margin: 0 1rem;
}

.dot {
  @include size(1.5rem);
  border: 1px solid $white;
  border-radius: 50%;
  transition: var(--hover-transition);
  transform: scale(0.8);

  &:hover {
    border-color: $pink;
  }
  &.active {
    border-color: transparent;
    background: $pink;
    transform: scale(1);
  }
}
</style>

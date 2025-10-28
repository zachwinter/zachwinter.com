<template>
  <nav>
    <button :class="{ active: active === tab }" @click="$emit('select', tab)" v-for="(tab, i) in value" :key="i">{{ tab }}</button>
  </nav>
</template>

<script setup lang="ts">
defineProps<{ value: any; active: string }>();
defineEmits(["select"]);
</script>

<style lang="scss" scoped>
$border: 0.15rem solid rgba($purple, 0.15);

nav {
  @include flex-row;
  @include gap;
  // min-height: 8rem;
}

button {
  @include flex-row;
  @include box(1 1.5);
  transition: var(--hover-transition);
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  border: $border;
  border-radius: 3rem;
  color: rgba($white, 0.5);
  box-shadow: 0 0 10rem 0 transparent;

  &:hover {
    color: rgba($purple, 0.6);
  }

  &:active {
    transform: scale(0.9);
  }

  &.active {
    box-shadow: 0 0 10rem 1rem lighten($black, 15%);
    color: $pink;
    border-color: $pink;
    background: transparent;
  }
}
</style>

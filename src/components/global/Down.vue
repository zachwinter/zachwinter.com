<template>
  <button :class="{ visible }" @click="() => $emit('click')">
    <DownIcon />
  </button>
</template>

<script setup lang="ts">
import DownIcon from '@/assets/svg/chevron-down.svg?component'

defineProps<{
  visible?: boolean
}>()

defineEmits(['click'])
</script>

<style lang="scss" scoped>
button {
  @include nav-button;
  @include position(fixed, initial null px(70) 50%);
}
</style>

<template>
  <button :class="{ visible }" @click="() => $emit('click')">
    <UpIcon />
  </button>
</template>

<script setup lang="ts">
import UpIcon from '@/assets/svg/chevron-up.svg?component'

defineProps<{
  visible: boolean
}>()

defineEmits(['click'])
</script>

<style lang="scss" scoped>
button {
  @include nav-button;
  @include position(fixed, px(70) null null 50%);
}
</style>

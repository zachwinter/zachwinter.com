<template>
  <div class="close-button">
    <IconButton icon="close" @click="$emit('close')" />
  </div>
</template>

<script setup lang="ts">
import IconButton from "./IconButton.vue";

defineEmits(["close"]);
</script>

<style lang="scss" scoped>
.icon-button {
  background: $pink !important;
  outline: 0 !important;
  box-shadow: 0 1px 0 1px $black;
  border: 1px solid transparent;

  &:hover {
    background: lighten($black, 30%) !important;
    border-color: rgba($purple, 0.6);
  }
}
</style>

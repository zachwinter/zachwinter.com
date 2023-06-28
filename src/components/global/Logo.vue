<template>
  <div class="logo">
    <Logo />
  </div>
</template>

<script setup lang="ts">
import Logo from '@/assets/svg/logo.svg?component'
</script>

<style lang="scss" scoped>
.logo {
  @include position(fixed, 0 null null calc(var(--outer-padding) + #{notch(left)}));
  @include size(px(120));
  @include shadow;
  @include flex;
  border-radius: var(--border-radius);
  padding: px(10);
  background: var(--white);
  z-index: 100;
  will-change: transform, opacity;

  @include mobile-landscape {
    @include size(px(150));
  }

  svg {
    @include size(90%);
  }

  :deep(*) {
    stroke: var(--gray);
  }
}
</style>

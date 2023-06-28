<template>
  <header :class="{ visible: t.visible && t.text?.length, [t.type]: t.type }">
    <p class="message">{{ t.text }}</p>
  </header>
</template>

<script setup lang="ts">
const t = useToast()
</script>

<style lang="scss" scoped>
header {
  @include position(fixed, var(--outer-padding) null null 50%);
  @include shadow;
  transform: translateX(-50%) translateY(-100%);
  opacity: 0;
  z-index: 10000;
  transition: var(--base-transition);
  will-change: transform, opacity;
  font-family: Bungee;
  background: var(--white);
  border-radius: px(50);

  &.visible {
    opacity: 1;
    transform: translateX(-50%) translateY(0%);
  }

  .message {
    @include type(32, 32, 400);
    color: var(--gray);
    padding: 0 var(--outer-padding);
    font-family: 'Bungee Hairline', sans-serif;
    height: px(90);
    line-height: px(90);
    white-space: nowrap;
  }

  @include mobile-portrait {
    border-radius: px(100);

    .message {
      // height: px(150);
      // line-height: px(150);
      // font-size: px(70);
    }
  }

  // @include mobile-portrait {
  //   @include type(60, 60, 300);
  //   // @include size(100%, px(150));
  //   line-height: px(150);
  //   height: px(150);
  //   // top: 0;
  //   // left: 0;

  //   .message {
  //     @include type(60, 60, 300);
  //   }
  // }
}
</style>

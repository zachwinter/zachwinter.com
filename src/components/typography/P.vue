<template>
  <p><slot /></p>
</template>

<style lang="scss" scoped>
p {
  font-size: px(32);
  line-height: px(40);
  color: var(--gray);

  @include mobile-portrait {
    font-size: px(42);
    line-height: px(55);
  }
}
</style>

<template>
  <h2><slot /></h2>
</template>

<style lang="scss" scoped>
$size: 100;
$offset: 0.25;

h2 {
  font-family: 'Red Hat Mono', sans-serif;
  white-space: nowrap;
  font-weight: 700;
  font-size: px($size);
  line-height: px($size);

  @include mobile-landscape {
    font-size: px(100);
    line-height: px(100);
  }
}
</style>

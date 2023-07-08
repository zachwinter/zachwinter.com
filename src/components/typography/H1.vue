<template>
  <h1><slot /></h1>
</template>

<style lang="scss" scoped>
$size: 220;
$line: 160;
$offset: 0.25;

h1 {
  font-family: 'Bungee Hairline', sans-serif;
  white-space: nowrap;
  font-weight: 400;
  font-size: px($size);
  line-height: px($line);

  @include mobile-landscape {
    font-size: px(#{$size * .85});
    line-height: px(#{$size * .85});
  }

  @include mobile-portrait {
    font-size: px(#{$size * .5});
    line-height: px(#{$size * .5});
  }
}
</style>

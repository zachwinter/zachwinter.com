<template>
  <H1>
    DEFEND
    <br />
    the
    <br />
    FRONT-END
  </H1>
</template>

<style lang="scss" scoped>
$size: 220;
$offset: 0.25;

nav {
  display: flex;
  gap: var(--outer-padding);
  width: auto;
  margin-top: var(--outer-padding);
  flex-grow: 0;
  font-size: 1rem;

  height: px($size);

  @include mobile-landscape {
    font-size: px(#{$size * 0.85});
    line-height: px(#{$size * 0.85});
  }

  @include mobile-portrait {
    font-size: px(#{$size * 0.5});
    line-height: px(#{$size * 0.5});
  }
}

a,
button {
  @include button;
  font-weight: 100 !important;
}

nav a:first-of-type {
  background: var(--pink);
}
</style>

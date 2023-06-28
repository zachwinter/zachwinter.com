<template>
  <View>
    <div class="hero">
      <Heading />
    </div>
  </View>
</template>

<style lang="scss" scoped>
.hero {
  top: 50%;
  transform: translateY(-50%);
  padding-left: calc(#{notch(left)} + var(--outer-padding));
}
</style>

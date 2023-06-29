<template>
  <View center>
    <H2>tell<br/> me<br/> your<br/> secrets</H2>
    <nav>
      <a href="mailto:contact@zachwinter.com" target="email">Email</a>
      <a href="tel:8508428313" target="phone">Phone</a>
      <a href="https://telegram.me/yozic" target="telegram">Telegram</a>
      <a href="https://www.instagram.com/zachary.io" target="instagram">Instagram</a>
    </nav>
  </View>
</template>

<style lang="scss" scoped>
.view {
  @include flex;
  @include scroll-bar;
  padding-left: notch(left);
}

nav {
  @include flex(center, flex-start, row);
  width: 100%;
  gap: var(--base-spacer);
  padding: var(--outer-padding);
}

h2 {
  width: 100%;
  padding: var(--outer-padding);
  font-weight: 700;
  color: var(--pink);
}

a {
  font-family: 'Red Hat Mono';
  text-decoration: none;
  transform: none;
  font-weight: 700;
  text-transform: uppercase;
  color: rgba(0, 0, 0, .5);
  border: 1px solid var(--gray);
  padding: .25rem .5rem;
  font-size: px(28);
}
</style>
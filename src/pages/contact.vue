<template>
  <View center>
    <H2>tell<br/> me<br/> your<br/> secrets</H2>
    <nav>
      <a href="mailto:contact@zachwinter.com" target="email">Email</a>
      <a href="tel:8508428313">Phone</a>
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
}

a {
  font-family: 'Red Hat Mono';
  text-decoration: none;
  transform: none;
  font-weight: 300;
  // text-transform: uppercase;
  color: rgba(0, 0, 0, .5);
  border: 1px solid var(--gray);
  padding: px(10) px(20);
  font-size: px(22);
  transition: var(--hover-transition);

  &:hover {
    background: var(--gray);
    color: var(--white);
  }

  &:active {
    transform: scale(.9);
  }

  @include dark-mode {
    color: rgba(255, 255, 255, .5);
  }
}
</style>
<template>
  <section>
    <div>
      <H2
        >tell<br />
        me<br />
        your<br />
        secrets</H2
      >
      <nav>
        <a href="mailto:contact@zachwinter.com" target="email">Email</a>
        <a href="tel:8508428313">Phone</a>
        <a href="https://telegram.me/yozic" target="telegram">Telegram</a>
        <a href="https://www.instagram.com/zachary.io" target="instagram">Instagram</a>
      </nav>
    </div>
  </section>
</template>

<style lang="scss" scoped>
section {
  @include size(100vw, 100vh);
  @include flex;
  @include scroll-bar;
  padding-left: notch(left);
}

nav {
  // @include flex(center, flex-start, row);
  width: 100%;
  gap: var(--base-spacer);
  padding: 1rem;
}

h2 {
  width: 100%;
  font-weight: 400;
  padding: 1rem;
}

a {
  font-family: 'Red Hat Mono';
  text-decoration: none;
  transform: none;
  font-weight: 300;
  padding: px(10) px(20);
  font-size: px(22);
  color: $purple;
  border: 1px solid rgba($purple, 0.25);
  transition: var(--hover-transition);
  border-right: 0;

  &:last-of-type {
    border-right: 1px solid rgba($purple, 0.25);
  }

  &:hover {
    color: var(--pink) !important;
  }

  &:active {
    transform: scale(0.9);
  }
}

@media (max-width: 768px) {
  h2 {
    font-size: 1.5rem;
    line-height: 1;
  }

  nav {
    @include flex-column(center, start);
  }
}
</style>

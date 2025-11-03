<template>
  <Section title="Contact" description=" ">
    <H2
      >tell<br />
      me<br />
      your<br />
      secrets</H2
    >
    <nav>
      <a href="mailto:contact@zachwinter.com" target="email"><Mail /></a>
      <a href="tel:+18508428313" target="phone"><Smartphone /></a>
      <a href="http://github.com/zachwinter" target="github"><Github /></a>
      <a href="https://www.instagram.com/zachary.io" target="instagram"><Instagram /></a>
    </nav>
  </Section>
</template>

<script setup lang="ts">
import { Mail, Smartphone, Instagram, Github } from 'lucide-vue-next'
</script>
<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Doto:wght,ROND@100,0..100&family=League+Script&display=swap');

nav {
  @include flex-row;
  @include box;
}

h2 {
  font-family: 'League Script';
  width: 100%;
  text-align: center;
  font-weight: 400;
  padding: 1rem;

  @include mobile {
    font-size: 3rem;
    line-height: 1;
  }
}

br {
  display: none;

  @include mobile {
    display: block;
  }
}

a {
  text-decoration: none;
  transform: none;
  color: $purple;
  transition: var(--hover-transition);

  &:hover {
    color: var(--pink) !important;
  }

  &:active {
    transform: scale(0.9);
  }

  svg {
    @include size(3rem);
    stroke-width: 0.5;
  }
}

@include mobile {
  nav {
    @include flex-row(center, start);
    flex-wrap: wrap;
  }
}
</style>

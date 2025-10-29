<template>
  <div class="outer">
    <div class="container">
      <header>
        <figure>
          <i />
          <i />
          <i />
        </figure>

        <div class="title-link">
          <span class="title">{{ title }}</span>
          <span class="link">{{ link }}</span>
        </div>
        <Link class="github" :href="github" target="_blank">
          <GithubIcon v-if="github" />
        </Link>
      </header>
      <section class="image-container">
        <img v-for="(image, i) in images" :key="i" :src="image" />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import GithubIcon from '@/assets/svg/github.svg?component'

defineProps<{
  description?: any
  title: any
  github?: any
  link?: string
  images: string[]
}>()
</script>

<style lang="scss" scoped>
$header-height: 2rem;
$border: none; //px(5) solid rgba(0, 0, 0, .1);

.container {
  @include size(100%);
  @include shadow;
  position: relative;
  margin: 0 auto;
  flex-shrink: 0;
  padding-top: $header-height;
  border-radius: 1rem;

  overflow: hidden;
  border: $border;
  border-right: 0;

  background: rgba(0, 0, 0, 0.5);
  overflow: hidden;
  will-change: transform;
  color: white;

  @include mobile-portrait {
    @include size(calc(100% - 2rem), auto);
    padding-left: 0;
  }
}

section {
  @include flex(flex-start, flex-start, row);
  @include size(100%);

  overflow-x: scroll;
  overflow-y: hidden;
  will-change: transform, opacity;
  background: var(--black);
  padding: 0;

  img {
    @include size(100%, auto);
    display: block;
    margin: 0;

    &:nth-child(1) {
      position: relative;
    }
  }
}

i {
  @include size(0.85rem);
  display: block;
  border-radius: 100%;

  &:first-child {
    background: $pink;
  }

  &:nth-child(2) {
    background: $yellow;
  }

  &:nth-child(3) {
    background: $green;
  }
}

.image-container {
  scroll-snap-type: x mandatory;

  :deep(> *) {
    scroll-snap-align: start;
  }
}

header {
  @include size(100%, auto);
  @include position(absolute, 0 0 null 0);
  gap: calc(var(--base-spacer) / 2);
  background-color: $black;
  z-index: 10;
  padding-left: var(--base-spacer);
}
header {
  @include flex-row(space-between);
  width: 100%;
}

header div {
  @include box(0.5, 0.5);
  margin: 0.5rem auto;
  background: lighten($black, 5%);
  border-radius: 0.5rem;
}

figure {
  @include flex-row(start);
  @include gap(0.35);
  width: 125px;
}

.github {
  @include size(2rem);
  @include flex(end);
  width: 125px;
  padding: 0 1rem 0 0;

  :deep(button) {
    @include size(2rem);
    @include flex;
    background: transparent;
    padding: 0;
    box-shadow: none;
    outline: 0;
    margin: 0;
  }

  :deep(svg *) {
    transition: var(--base-transition);
    fill: $white;
  }

  &:hover :deep(svg *) {
    fill: var(--blue);
  }
}

.title {
  padding: 0 0.5rem;
  color: $pink;
}

.outer {
  @include size(100vw, 100%);
  @include flex;
}

.link {
  display: none;

  @media (min-width: 768px) {
    display: flex;
  }
}

.title-link {
  @include flex-row;
}
</style>

<template>
  <View center>
    <div>
      <H2>{{ data.title }}</H2>
      <P>{{ data.description }}</P>
      <Tags :tags="data.tags" />
      <div class="links">
        <Link :href="data.link" target="_blank">Visit Project</Link>
        <Link class="github" :href="data.github" target="_blank">
          <GithubIcon />
        </Link>
      </div>
    </div>

    <Images :images="data.images" />
  </View>
</template>

<script setup lang="ts">
import GithubIcon from '@/assets/svg/github.svg?component'

const data = ref({
  title: '5HT',
  description: 'A WebGL music visualizer that integrates with Spotify, Audius, or your microphone.',
  link: 'https://www.kaleidosync.com',
  github: 'https://github.com/zachwinter/kaleidosync',
  tags: [
    'UI Design',
    'Vue',
    'TypeScript',
    'Sass',
    'WebGL',
    'GLSL',
    'Web Audio',
    'Vite',
    'Node',
    'Express',
    'MongoDB',
    'CI / CD'
  ],
  images: [
    '/screenshots/5ht.01.jpg',
    '/screenshots/5ht.02.jpg',
    '/screenshots/5ht.03.jpg',
    '/screenshots/5ht.04.jpg'
  ]
})
</script>

<style lang="scss" scoped>
div {
  @include flex(flex-start, center, column);
  @include vertical-rhythm;
  padding: var(--outer-padding);
}

h1 {
  // font-family: 'Bungee Outline';
}
.view {
  @include mobile-portrait {
    @include flex(center, center, column);
  }
}

.github {
  @include size(var(--element-height));
  @include flex;
  margin: 0 0 0 var(--base-spacer);
  padding: 0;

  :deep(button) {
    @include size(var(--element-height));
    @include flex;
    padding: 0;
    margin: 0;
  }
}

svg {
  @include size(100%);
  display: block;
  pointer-events: none;

  :deep(*) {
    fill: white;
  }
}

.links {
  @include flex(flex-start, flex-start, row);
  padding: 0;
}
</style>

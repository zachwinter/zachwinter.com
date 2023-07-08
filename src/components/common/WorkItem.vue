<template>
  <Section center>
    <div class="content">
      <H2>
        <span class="title">{{ item.title }}</span>
        <span v-if="item.subtitle"> | previously <strong >{{ item.subtitle }}</strong></span>
      </H2>
      <div class="links">
        <Link :href="item.link" target="_blank">{{  item.link }}</Link>
        <Link class="github" :href="item.github" target="_blank" v-if="item.github">
          <GithubIcon />
        </Link>
      </div>
      <P>{{ item.description }}</P>
      <Images v-if="mobile" :images="item.images" />
      <Tags :tags="item.tags" />
    </div>

    <Images v-if="!mobile" :images="item.images" />
  </Section>
</template>

<script setup lang="ts">
import GithubIcon from '@/assets/svg/github.svg?component'

const viewport = useViewport()

defineProps<{
  item: any
}>()

const mobile = computed(() => viewport.mobile && viewport.orientation === 'PORTRAIT')
</script>

<style lang="scss" scoped>
.content {
  @include flex(flex-start, center, column);
  padding: 0 var(--outer-padding) 0 calc(#{notch(left)} + var(--outer-padding));
;

  @include mobile-portrait {
    width: 100%;
    height: auto;
    // padding: 0 var(--outer-padding);
  }
}

section {
  @include mobile-portrait {
    @include flex(center, center, column);
  }
}

h2 span {
  font-weight: 300;
  font-size: 1.2rem;

  strong {
    font-weight: 700;
  }
}

.title {
  font-size: 3rem;
}

.github {
  @include size(var(--element-height));
  @include flex;
  margin: 0 0 0 var(--base-spacer);
  padding: 0;

  :deep(button) {
    @include size(var(--element-height));
    @include flex;
    background: transparent;
    padding: 0;
    box-shadow: none;
    outline: 0;
    margin: 0;
  }
}

svg {
  @include size(80%);
  display: block;
  pointer-events: none;

  :deep(*) {
    fill: var(--pink);
  }
}

.links {
  @include flex(center, space-between, row);
  width: 100%;
  padding: 0;
  font-size: px(28);

  :deep(*) {
    font-size: inherit;
    padding: 0;
  }
}
</style>

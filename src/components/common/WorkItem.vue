<template>
  <Section center>
    <div class="content">
      <Images v-if="mobile" :images="item.images" />
    </div>

    <Images v-if="!mobile" v-bind="item" />
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
  font-size: 4rem;
  font-weight: 100;
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
  @include flex(flex-start, flex-start, row);
  width: 100%;
  padding: 0;
  font-size: px(28);
  white-space: nowrap;
  text-align: left;

  :deep(*) {
    font-size: inherit;
    padding: 0;
  }
}
</style>

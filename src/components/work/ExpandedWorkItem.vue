<template>
  <View class="expanded-work-item" :class="{ visible }">
    <header>
      <Button class="close" @click="$emit('close')">Close</Button>
      <H1>{{ visibleItem?.title }}</H1>
      <P>{{ visibleItem?.description }}</P>
      <ul class="tags">
        <li v-for="(tag, i) in visibleItem?.tags || []">{{ tag }}</li>
      </ul>
      <Button class="visit"><a :href="visibleItem?.link" :target="visibleItem?.title">Visit Project</a></Button>
    </header>
    <section v-if="content === null" class="screenshots">
      <img v-for="(image, i) in visibleItem?.images || []" :src="image" />
    </section>
    <component v-else class="padded" :is="content" />
  </View>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    item: object | null
    visible: boolean
    content: any
  }>(),
  {
    item: null,
    visible: false,
    content: null
  }
)

const visibleItem: any = ref(null)

watch(
  () => props.item,
  (val, old) => {
    if (val) {
      visibleItem.value = val
    }

    if (!val && old) {
      visibleItem.value = old
    }
  }
)

const $emit = defineEmits(['close'])
</script>

<style lang="scss" scoped>
.view.expanded-work-item {
  @include position(fixed, 100vh 0 0 0);
  @include scroll-bar;
  display: block;
  padding: 0;
  overflow-y: scroll;
  gap: var(--base-spacer);
  opacity: 0;
  transition: all var(--page-duration) var(--easing);
  z-index: 1000;
  pointer-events: none;
  background: var(--white);
  will-change: transform, opacity;
  transform-origin: top left;

  &.visible {
    opacity: 1;
    pointer-events: all;
  }
}

header {
  @include flex(flex-start, center);
  padding: var(--outer-padding);
  height: 50vh;
}

h1 {
  max-width: 70%;
  white-space: normal;
}

.tags {
  list-style: none;

  li {
    @include shadow;
    font-family: 'Bungee', sans-serif;
    font-size: px(18);
    font-weight: 400;
    // background: var(--gray);
    color: var(--pink);
    display: inline-flex;
    padding: px(10);
    border-radius: px(50);
    margin-right: calc(var(--base-spacer) / 2);
    margin-top: calc(var(--base-spacer) / 2);

    @include mobile-portrait {
      @include type(32, 50, 400);
      padding: px(10) px(30);
    }
  }
}

.visit {
  margin-top: calc(2 * var(--base-spacer));
  padding: 0;
  
  a {
    @include size(100%);
    display: inline-block;
    padding: px(20) px(30);

    @include mobile-portrait {
      padding: px(30) px(40);
      font-size: px(34);
    }
  }
}

.close {
  @include position(absolute, var(--outer-padding) var(--outer-padding) null null);
  z-index: 2000;
  margin: 0;
}

.screenshots {
  display: flex;
  flex-wrap: wrap;

  img {
    width: 50%;
  }

  @include mobile-portrait {
    img {
      @include size(100%, auto);
    }
  }
}

.padded {
  // padding: var(--outer-padding);
}

.features {
  @include flex(flex-start, flex-start, row);
  flex-wrap: wrap;

  li {
    @include size(25%, 20vh);
    font-size: px(28);
    padding: var(--outer-padding);
    list-style: none;
  }
}
</style>

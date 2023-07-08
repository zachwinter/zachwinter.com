<template>
  <ul>
    <li v-for="(tag, i) in tags" :key="i">{{ tag }}</li>
  </ul>
</template>

<script setup lang="ts">
defineProps<{
  tags: string[]
}>()
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
  margin: var(--outer-padding) 0 0 0;

  li {
    @include shadow;
    @include type(24, 40, 400);
    font-family: 'Red Hat Mono', sans-serif;
    background: var(--white); 
    display: inline-flex;
    padding: 0 px(15);
    margin-right: calc(var(--base-spacer) / 2);
    margin-bottom: calc(var(--base-spacer) / 2);
    background: var(--gray);
    color: var(--white);

    @include mobile-portrait {
      @include type(32, 40, 400);
      padding: px(10) px(30);
    }
  }
}
</style>

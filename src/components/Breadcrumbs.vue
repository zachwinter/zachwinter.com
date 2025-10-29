<template>
  <nav>
    <fieldset>
      <legend>work</legend>
      <a @click="$emit('select', 1)" :class="{ active: section === 1 }">kaleidosync</a>
      <a @click="$emit('select', 2)" :class="{ active: section === 2 }">covid-usa</a>
      <nav :class="{ visible: section === 2 }">
        <a @click="$emit('select-covid', 0)">11/05/2020</a>
        <a @click="$emit('select-covid', 1)">08/17/2021</a>
        <a @click="$emit('select-covid', 2)">12/25/2021</a>
      </nav>
    </fieldset>
    <a @click="$emit('select', 3)" :class="{ active: section === 3 }">contact</a>
  </nav>
</template>

<script setup lang="ts">
defineProps<{ section: number }>()
defineEmits(['select', 'select-covid'])
</script>

<style lang="scss" scoped>
nav {
  @include position(fixed, null null 1rem 1rem);
  @include flex-column(start, start);
  z-index: 9999;
  /* transform: translateY(-50%); */

  nav {
    @include flex-row;
    position: static;
    transform: none;
    height: 0;
    transition: all 350ms var(--easing);
    opacity: 0;
    font-size: 0.8rem;

    &.visible {
      height: 2rem;
      opacity: 1;
    }
  }
}

a {
  @include box(0.5 0.5, 0.5);
  border-left: 0.25rem solid transparent;
  transition: all 150ms var(--easing);
  background: rgba($black, 1);

  &:hover,
  &.active {
    color: $purple;
    cursor: pointer;
  }

  &.active {
    border-color: $purple;
  }

  &:active {
    transform: scale(0.95);
    transform-origin: left center;
  }
}

fieldset,
legend {
  @include flex-column(start, start);
  border: 0;
  padding: 0;
  margin: 0;
}

fieldset {
  @include box(0.5 0, 0);
}
</style>

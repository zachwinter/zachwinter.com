<template>
  <Row class="avatar" is="figure" :class="{ border }">
    <img :src="src" :alt="alt" />
  </Row>
</template>

<script lang="ts" setup>
import Row from "../layout/Row.vue";

const {
  alt,
  src,
  size = "var(--element-size)",
  border = true
} = defineProps<{
  alt?: string;
  src?: string;
  size?: string;
  border?: boolean;
}>();
</script>

<style lang="scss" scoped>
.avatar {
  width: v-bind(size);
  height: v-bind(size);
  border-radius: 100%;
  overflow: hidden;
}

img {
  @include size(100%);
  border-radius: 100%;
}

p {
  font-weight: 500;
}

.border {
  outline: 1px solid var(--primary-color);
  padding: 0.25rem;
}
</style>

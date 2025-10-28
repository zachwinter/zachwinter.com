<template>
  <IconButton
    @click="$emit('click')"
    :class="{ [`source_${sources?.source}`]: sources?.source !== undefined }"
    :icon="sources.sourceIcon"
    :label="label" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { IconButton } from "@/components";
import { useSources } from "@/stores";

defineEmits(["click"]);

const sources = useSources();
const label = computed(() => (true ? sources.prettySource ?? "Audio Source" : null));
</script>

<style lang="scss" scoped>
@each $source, $color in $source-colors {
  .source_#{$source} {
    border-width: 2px;
    border-color: $color !important;
    color: $color;

    &:hover {
      color: $color;
    }
  }
}
</style>

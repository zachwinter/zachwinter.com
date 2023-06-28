<template>
  <section>
    <Shader
      :fill-viewport="false"
      :fill-container="false"
      :width="viewport.width"
      :height="viewport.height * .8"
      :editor="true"
    />
  </section>
</template>

<script setup lang="ts">
const viewport = useViewport()
</script>

<style lang="scss" scoped>
section {
  @include size(100%, 80vh);
}

.shader {
  @include size(100%);
}

.editor {
  @include flex;
  position: relative;
  overflow: hidden;
}
</style>

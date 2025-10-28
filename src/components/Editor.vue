<template>
  <section class="editor-container">
    <GenericEditor
      class="editor"
      v-if="background.shader"
      v-model="background.shader"
      :language-id="`glsl`"
      :language-features="languageFeatures"
    />
    <Uniforms :focused="false" :focused-key="null" @update="onUpdate" />
  </section>
</template>

<script setup lang="ts">
import { GenericEditor } from '../editor/vue'
import { useBackground } from '../store/background'
const background = useBackground()
const languageFeatures = computed(() => ({ uniformKeys: background.uniforms.map((v) => v[0]) }))

function onUpdate(e) {
  background.uniforms[e.i][2][0] = e.value
}
</script>

<style lang="scss" scoped>
.editor {
  @include size(100vw, 100vh);
  display: flex;
  align-items: center;
}

.editor-container {
  @include flex-row(center, space-between);
  max-width: 75vw;
  margin: auto;
}

.uniforms {
  @include flex(end);
}
</style>

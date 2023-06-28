<template>
  <div class="shader" ref="container" @click="$emit('click')"/>
</template>

<script setup lang="ts">
import { Shader, type ShaderConfig } from 'fragment-shader';

defineEmits(['click'])

const props = withDefaults(defineProps<ShaderConfig>(), {
  width: window.innerWidth,
  height: window.innerHeight,
  dpr: window.devicePixelRatio,
  shader: `void main () { gl_FragColor = vec4(.8, .2, .6, 1.); }`,
  animate: true,
  fillViewport: false,
  variant: 0
});

const instance: Ref<Shader | null> = ref(null);
const container: Ref<HTMLElement | undefined> = ref();

defineExpose({ instance })

watch(
  () => [props.width, props.height, props.dpr],
  ([width, height, dpr]) => {
    if (!instance.value) return
    instance.value.size = { width, height, dpr }
  }
);

watch(
  () => props.shader,
  (shader) => {
    if (!instance.value) return
    instance.value.rebuild({ shader, uniforms: props.uniforms })
  }
)

onMounted(() => {
  if (!container.value) return;

  instance.value = new Shader({
    ...props,
    parent: container.value
  });
});

onBeforeUnmount(() => {
  instance.value?.destroy?.()
})
</script>

<style lang="scss" scoped>
.shader {
  @include position(fixed, 0 null null 0);
}
</style>